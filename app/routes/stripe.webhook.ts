import type { ActionFunction} from '@remix-run/node';
import { json } from '@remix-run/node';
import Stripe from 'stripe';
import { sendEmail } from '~/lib/email';
import { incrementSoldTickets } from '~/models';
import { createOrder } from '~/models/Order';
import { createTicketFromOrder } from '~/models/Ticket';
import signale from 'signale'

export const action: ActionFunction = async ({ request }) => {
	const stripe = new Stripe(process.env.STRIPE_SCRET_KEY!, {
		apiVersion: '2020-08-27'
	});

	const stripeSignature = request.headers.get('stripe-signature')

	if (  !stripeSignature ) {
		return json({
			status: 401,
			body: 'No Signature',
		}, { status: 401 })
	}

	let event: Stripe.Event | null = null
	try {
		const payload = await request.text()
		event = stripe.webhooks.constructEvent(payload, stripeSignature, 'whsec_1426551ef8b7162576629f2d5d92740d9153795462fb5ca95af23190ea2ba999')
	} catch (error) {
		signale.error(error)
		return new Response((error as Stripe.errors.StripeSignatureVerificationError).message, { status: 400 })
	}

	try {
		switch ( event.type ) {
			case 'checkout.session.completed':
				const session = event.data.object as Stripe.Checkout.Session;

				if ( !session.metadata?.event_id ) {
					return json({
						status: 400,
						message: 'No event id provided',
					}, { status: 400 })
				}

				const order = await createOrder(session.metadata.event_id, session)

				if (order.error) {
					signale.warn('Failed to create order');
					signale.error(order.error);

					return json(order.error, {
						status: 500
					})
				}

				const ticket = await createTicketFromOrder(order.data, session.metadata?.tier_id as any ?? null)

				if ( ticket.error ) {
					signale.warn('Failed to create ticket');
					signale.error(ticket.error);

					signale.debug('Order Data', order.data)
					signale.debug('metadata', session.metadata);


					return json(ticket.error, {
						status: 500
					})
				}

				const incrementSoldTicketResponse = await incrementSoldTickets(order.data.event_id, 1)

				if ( incrementSoldTicketResponse.error ) {
					signale.warn('Failed to increment sold ticket count');
					signale.error(incrementSoldTicketResponse.error);
				}

				// Send email with ticket.
				await sendEmail(ticket.data.email)

				return new Response(null, { status: 201 })
			default:
				break
		}
	} catch (error) {
		signale.error(error)

		return json(error, {
			status: 500
		})
	}

	return new Response()
}

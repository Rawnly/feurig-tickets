import type { ActionFunction} from '@remix-run/node';
import { json } from '@remix-run/node';
import Stripe from 'stripe';
import { sendEmail } from '~/lib/email';
import { createOrder } from '~/models/Order';
import { createTicketFromOrder } from '~/models/Ticket';

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
		console.error(error)
		return new Response((error as Stripe.errors.StripeSignatureVerificationError).message, { status: 400 })
	}

	try {
		switch ( event.type ) {
			case 'checkout.session.completed':
				const session = event.data.object as Stripe.Checkout.Session;

				if ( !session.metadata?.event_id ) {
					console.error('No EVENT_ID');

					return json({
						status: 400,
						message: 'No event id provided',
					}, { status: 400 })
				}

				const order = await createOrder(session.metadata.event_id, session)

				if (order.error) {
					console.error('Failed to create order');
					console.error(order.error);

					return json(order.error, {
						status: 500
					})
				}

				const ticket = await createTicketFromOrder(order.data?.[0])

				if ( ticket.error ) {
					console.error('Failed to create ticket');
					console.error(ticket.error);

					return json(ticket.error, {
						status: 500
					})
				}

				// Send email with ticket.
				await sendEmail(ticket.data[0].email)

				return new Response(null, { status: 201 })
			default:
				break
		}
	} catch (error) {
		console.error(error)

		return json(error, {
			status: 500
		})
	}

	return new Response()
}

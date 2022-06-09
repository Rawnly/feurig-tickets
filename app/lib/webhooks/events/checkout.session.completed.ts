import { json } from '@remix-run/node';
import signale from 'signale';
import type Stripe from 'stripe';
import { sendEmail } from '~/lib/email';
import { updateOptimisticTicket } from '~/models';

export default async function(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session;

	if ( !session.metadata?.event_id ) {
		return json({
			status: 400,
			message: 'No event id provided',
		}, { status: 400 })
	}

	const ticket = await updateOptimisticTicket(session.payment_intent as string, {
		email: session.customer_details?.email!,
		event_id: parseInt(session.metadata.event_id as string),
		stripe_customer: session.customer as string,
		full_name: session.customer_details?.name!,
		tier_id: session.metadata?.tier_id as any ?? null
	})

	if ( ticket.error ) {
		signale.warn('Failed to update ticket');
		signale.error(ticket.error);

		signale.debug('metadata', session.metadata);

		return json(ticket.error, {
			status: 500
		})
	}

	// Send email with ticket.
	await sendEmail(ticket.data.email!)

	return new Response(null, { status: 201 })
}

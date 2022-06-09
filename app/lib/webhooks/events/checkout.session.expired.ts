import { json } from '@remix-run/node';
import signale from 'signale';
import type Stripe from 'stripe';
import { removeTicket } from '~/models';

export default async function(event: Stripe.Event) {
	const session = event.data.object as Stripe.Checkout.Session
	const response = await removeTicket(session.payment_intent as string)

	if ( response.error ) {
		signale.warn('Failed to remove ticket with payment_intent :=', session.payment_intent);
		signale.error(response.error)

		return json(response.error, {
			status: 500
		})
	}

	return new Response(null, { status: 200 })
}

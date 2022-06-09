import { json } from '@remix-run/node';
import signale from 'signale';
import type Stripe from 'stripe';
import { createOptmisticTicket as createEmptyTicket, incrementSoldTickets } from '~/models';

export default async function(event: Stripe.Event) {
	const payment_intent = event.data.object as Stripe.PaymentIntent

	const event_id = parseInt(payment_intent.metadata.event_id as string)
	const tier_id = parseInt(payment_intent.metadata.tier_id as string) || null

	const ticket = await createEmptyTicket(payment_intent.id, event_id, tier_id);

	if ( ticket.error ) {
		signale.warn('Failed to create optmistic ticket');
		signale.error(ticket.error);

		return json(ticket.error, {
			status: 500
		})
	}


	const incrementSoldTicketResponse = await incrementSoldTickets(ticket.data.event_id, 1)

	if ( incrementSoldTicketResponse.error ) {
		signale.warn('Failed to increment sold ticket count');
		signale.error(incrementSoldTicketResponse.error);

		return json(incrementSoldTicketResponse.error, {
			status: 500
		})
	}

	return json(ticket.data, { status: 201 })
}

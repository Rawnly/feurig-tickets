import type Stripe from 'stripe';
import { supabase } from '~/lib/supabase-client';

export interface IOrder {
	id: number
	event_id: number;
	email: string
	name?: string
	customer_id: string
	amount: number
}

export const createOrder = (eventId: string, session: Stripe.Checkout.Session) => {
	if (!eventId) {
		throw new Error('No event id provided')
	}

	return supabase.from<IOrder>('orders').insert({
		event_id: parseInt(eventId),
		email: session.customer_details?.email ?? '--',
		name: session.customer_details?.name ?? '--',
		customer_id: session.customer as string | undefined,
		amount: session.amount_total ?? 0,
	})
}

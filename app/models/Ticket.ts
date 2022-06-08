import signale from 'signale';
import { supabase } from '~/lib/supabase-client';
import type { IOrder } from './Order';

export interface ITicket {
	id: string;
	event_id: number;
	email: string;
	created_at: string;
	order_id: number;
	tier_id: number | null;
	full_name?: string;
	code: string;
	stripe_customer?: string;
}

export const createTicketFromOrder = (order: IOrder, tier_id: number | null) => {
	signale.debug('createTicketFromOrder', order, tier_id);

	return supabase.from<ITicket>('tickets')
		.insert({
			order_id: order.id,
			event_id: order.event_id,
			stripe_customer: order.customer_id,
			email: order.email,
			full_name: order.name,
			tier_id: tier_id || null
		})
		.single()
}

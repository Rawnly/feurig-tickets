import { supabase } from '~/lib/supabase-client';
import type { IOrder } from './Order';

export interface ITicket {
	id: string;
	event_id: number;
	email: string;
	created_at: string;
	order_id: number;
	full_name?: string;
	code: string;
	stripe_customer?: string;
}

export const createTicketFromOrder = (order: IOrder) => {
	return supabase.from<ITicket>('tickets').insert({
		order_id: order.id,
		event_id: order.event_id,
		stripe_customer: order.customer_id,
		email: order.email,
		full_name: order.name
	})
}

import signale from 'signale';
import { supabase } from '~/lib/supabase-client';

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

interface ICreateTicket {
	event_id: number;
	stripe_customer: string,
	email: string
	full_name: string
}

export const createTicketFromOrder = (order: ICreateTicket, tier_id: number | null) => {
	signale.debug('createTicketFromOrder', order, tier_id);

	return supabase.from<ITicket>('tickets')
		.insert({
			event_id: order.event_id,
			stripe_customer: order.stripe_customer,
			email: order.email,
			full_name: order.full_name,
			tier_id: tier_id || null
		})
		.single()
}

import type { PostgrestError } from '@supabase/supabase-js';
import signale from 'signale';
import logger from '~/lib/logger.server';
import { supabase } from '~/lib/supabase-client';

export interface ITicket {
	id: string;
	event_id: number;
	email?: string;
	created_at: string;
	order_id: number;
	tier_id: number | null;
	full_name?: string;
	code: string;
	stripe_customer?: string;
	status: 0 | 1
	payment_intent_id: string | null;
}

interface ICreateTicket {
	event_id: number;
	stripe_customer: string,
	email: string
	full_name: string
	tier_id: number | null
}

export const createTicket = (data: ICreateTicket, pid: string) => {
	signale.debug('createTicketFromOrder', data);

	return supabase.from<ITicket>('tickets')
		.insert({
			event_id: data.event_id,
			stripe_customer: data.stripe_customer,
			email: data.email,
			full_name: data.full_name,
			tier_id: data.tier_id || null,
			payment_intent_id: pid
		})
		.single()
}

export const updateOptimisticTicket = (pid: string, data: ICreateTicket) => {
	signale.debug('createTicketFromOrder', data);

	return supabase.from<ITicket>('tickets')
		.update({
			event_id: data.event_id,
			stripe_customer: data.stripe_customer,
			email: data.email,
			full_name: data.full_name,
			tier_id: data.tier_id || null,
			status: 1
		})
		.eq('payment_intent_id', pid)
		.eq('status', 0)
		.single()
}

export const createOptmisticTicket = (pid: string, event_id: number, tier_id: number | null) => {
	signale.debug('createOptmisticTicket', event_id, tier_id);

	return supabase.from<ITicket>('tickets')
		.insert({
			event_id: event_id,
			tier_id: tier_id || null,
			payment_intent_id: pid
		})
		.single()
}


export const countTicketsForEvent = async (eventId: number) => {
	const tickets = await supabase.from<ITicket>('tickets')
		.select('*', {
			count: 'exact'
		})
		.eq('event_id', eventId)

	if ( !tickets.error ) {
		return tickets.count ?? 0
	}

	logger.error(tickets.error)
	return Infinity
}

export const removeTicket = (paymentIntentId: string) =>
	supabase.from<ITicket>('tickets')
		.delete()
		.eq('payment_intent_id', paymentIntentId)
		.eq('status', 0)
		.single()

import logger from '~/lib/logger.server'
import { supabase } from '~/lib/supabase-client'
import { countTicketsForEvent, ITicket } from './Ticket'


export interface IEvent {
	id: number
	title: string
	description: string
	enabled: boolean
	slug: string
	price: number
	date: string
	people: { name: string; link?: string }[]
	total_tickets: number
	sold_tickets: number
	image_url?: string
	flyer_image_url?: string
}

/**
 * See `get_all_events` stored procedure
 */
export interface IFullEvent {
    tier_id:         number | null;
    tier_price:      number | null;
    tier_name:       string | null;
    pending_tickets: number;
    tickets:         number;
    id:              number;
    title:           string;
    description:     string;
    max_tickets:     number;
    price:           number;
    date:            string;
    enabled?:         boolean;
    slug:            string;
    image_url?:       string;
    flyer_image_url?: string;
}


export interface IEventPrice {
	tier_id: number | null;
	tier_name: string | null;
	current_price: number | null
	base_price: number;
}


export const incrementSoldTickets = (eventId: number, by: number) => {
	return supabase.rpc<void>('increment_sold_ticket_count', {
		_event_id: eventId,
		amount: by
	}).single()
}

export const getEventPrice = (eventId: number) => {
	return supabase.rpc<IEventPrice>('get_event_price', {
		_event_id: eventId
	}).single()
}

export const getEventById = (eventId: number, throwOnError: boolean = false) => {
	return supabase.from<IEvent>('events')
		.throwOnError(throwOnError)
		.select('*')
		.eq('id', eventId)
		.single()
}

export const getEventBySlug = (slug: string) => {
	return supabase.from<IEvent>('events')
		.select('*')
		.eq('slug', slug)
		.single()
}

export async function canBuyTicket(eventId: number): Promise<boolean> {
	const event = await getEventById(eventId)

	if ( event.error ) {
		logger.error(event.error)
		return false
	}

	const ticketsCount = await countTicketsForEvent(eventId);


	return ticketsCount < event.data.total_tickets
}

export const getAllEvents = () => supabase.rpc<IFullEvent>('get_all_events')

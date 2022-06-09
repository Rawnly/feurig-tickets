import { supabase } from '~/lib/supabase-client'




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

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

interface IEventPrice {
	tierid: number | null;
	eventid: number;
	base_price: number;
	current_price: number | null
}


export const incrementSoldTickets = (eventId: number, by: number) => {
	return supabase.rpc<void>('increment_sold_ticket_count', {
		_event_id: eventId,
		amount: by
	}).single()
}

export const getEventPrice = (eventId: number) => {
	return supabase.rpc<IEventPrice>('geteventprice', {
		event_id: eventId
	}).single()
}

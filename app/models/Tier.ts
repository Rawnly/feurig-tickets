import { supabase } from '~/lib/supabase-client'

export interface Tier {
	id: number
	level: number

	name: string
	price: number
	tickets_count: number
	tickets_sold: number
	event_id: number
}

export const getCurrentTier = (eventId: number) => {
	return supabase.from<Tier>('tiers')
		.select('*')
		.gt('tickets_count', 'tickets_sold')
		.eq('event_id', eventId)
		.order('level')
		.limit(1)
		.single()
}

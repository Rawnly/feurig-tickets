



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

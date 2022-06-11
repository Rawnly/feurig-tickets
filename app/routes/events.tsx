import type { ActionFunction, LoaderFunction, MetaFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import signale from '../lib/logger.server';
import Stripe from 'stripe';
import EventCard from '~/components/EventCard';
import { supabase } from '~/lib/supabase-client';
import type { IEvent, IFullEvent } from '~/models';
import { getAllEvents } from '~/models';
import { countTicketsForEvent } from '~/models';
import { getEventPrice } from '~/models';
import Room from '~/components/Room';
import Layout from '~/components/Layout';

export const loader: LoaderFunction = async ({ params }) => {
	const { data } = await getAllEvents()
		.limit(10)

	return json(data)
}

export const action: ActionFunction = async ({ request }) => {
	const data = await request.formData()
	const eventId = data.get('eventId')

	if (!eventId) {
		return redirect('/events?error_code=NO_EVENT_ID')
	}

	const { data: event } = await supabase.from<IEvent>('events')
		.select('*')
		.eq('id', eventId.toString())
		.eq('enabled', true)
		.gt('date', new Date().toISOString())
		.single()

	if ( !event || !event.enabled ) {
		return redirect('/events?error_code=EVENT_EXPIRED_OR_DISABLED')
	}

	const ticketsCount = await countTicketsForEvent(event.id)

	if ( ticketsCount >= event.total_tickets ) {
		return redirect('/events?error_code=EVENT_SOLD_OUT')
	}

	const eventPrice = await getEventPrice(event.id)

	if ( eventPrice.error ) {
		signale.error(eventPrice.error)

		return json(eventPrice.error, {
			status: 500
		})
	}

	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
		apiVersion: '2020-08-27'
	})

	try {
		const session = await stripe.checkout.sessions.create({
			success_url: `${request.headers.get('origin')}/checkout-complete?state=success`,
			cancel_url: `${request.headers.get('origin')}/events?state=operation_cancelled`,
			mode: 'payment',
			expires_at: Math.round(new Date().getTime() / 1000) + 60 * 60,
			payment_intent_data: {
				metadata: {
					event_id: event.id,
					tier_id: eventPrice?.data?.tier_id ?? null
				},
			},
			submit_type: 'book',
			phone_number_collection: {
				enabled: true,
			},
			metadata: {
				event_id: event.id,
				tier_id: eventPrice?.data?.tier_id ?? null
			},
			line_items: [
				{
					quantity: 1,
					amount: eventPrice.data?.current_price ?? eventPrice.data?.base_price ?? event.price,
					name: `${eventPrice.data?.tier_name ? `[${eventPrice.data?.tier_name}]` : ''} Ticket for "${event.title}"`,
					currency: 'eur',
					description: event.description
				}
			]
		})

		if (!session.url) {
			signale.error('No session url for session_id :=', session.id)

			return json({
				error: 'No session url'
			})
		}

		return redirect(session.url, {
			status: 301,
		})
	} catch (error) {
		signale.error(error);

		const {
			statusCode,
			type,
			message,
			headers
		} = error as Stripe.errors.StripeAPIError

		return redirect(`/events?error_code=${type}&error_message=${message}`, {
			status: statusCode,
			headers
		})
	}
}

export const meta: MetaFunction = () => ({
	title: 'Flanda | Events',
})

export default function Events() {
	const events = useLoaderData<IFullEvent[]>()

	useEffect(() => {
		loadStripe((window as any).ENV.STRIPE_PUBLIC_KEY)
	}, [])

	return (
		<Layout>
			<div className='flex flex-col items-center justify-start space-y-16'>
				{events?.map(evt => (
					<EventCard showDate event={evt} key={evt.id} />
				))}
			</div>
		</Layout>
	)
}

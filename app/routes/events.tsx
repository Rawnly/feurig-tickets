import type { ActionFunction, LoaderFunction, MetaFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect } from 'react';
import Stripe from 'stripe';
import Button from '~/components/Button';
import { supabase } from '~/lib/supabase-client';
import type { IEvent } from '~/models';

export const loader: LoaderFunction = async ({ params }) => {
	const { data } = await supabase
		.from<IEvent>('events')
		.select('*')

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
		.gt('date', new Date().toISOString())
		.single()

	if ( !event || !event.enabled ) {
		return redirect('/events?error_code=EVENT_EXPIRED_OR_DISABLED')
	}

	const stripe = new Stripe(process.env.STRIPE_PUBLIC_KEY!, {
		apiVersion: '2020-08-27'
	})

	try {
		const session = await stripe.checkout.sessions.create({
			success_url: `${request.headers.get('origin')}?state=success`,
			cancel_url: `${request.headers.get('origin')}?state=canceled`,
			mode: 'payment',
			metadata: {
				event_id: event.id
			},
			line_items: [
				{
					quantity: 1,
					amount: event.price,
					name: `Ticket | ${event.title}`,
					currency: 'eur',
					description: event.description
				}
			]
		})

		if (!session.url) {
			return json({
				error: 'No session url'
			})
		}

		return redirect(session.url, {
			status: 301,
		})
	} catch (error) {
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
	const events = useLoaderData<IEvent[]>()

	useEffect(() => {
		loadStripe((window as any).ENV.STRIPE_PUBLIC_KEY)
	  }, [])

	return (
		<div>
			{events?.map(evt => (
				<Form method='post' key={evt.id} className='flex max-w-2xl gap-4'>
					<input type="hidden" name='eventId' value={evt.id} />
					<div className='min-w-[300px]'>
						<img
							src={evt.flyer_image_url ?? 'https://via.placeholder.com/300x300'}
							alt={evt.slug}
							onError={({currentTarget}) => currentTarget.src = 'https://via.placeholder.com/200x200/000?text='+evt.slug}
							className='aspect-square w-[300px] h-[300px] bg-black'
						/>
						<Button type='submit' theme='auto' className='w-full mt-2'>BUY TICKETS</Button>
					</div>
					<div className='flex flex-col gap-4'>
						<h2 className='text-3xl font-bold'>{evt.title}</h2>
						<p className='text-codGray-800 text-sm leading-relaxed text-justify'>{evt.description}</p>
					</div>
				</Form>
			))}
		</div>
	)
}

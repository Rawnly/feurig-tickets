import type { LoaderFunction} from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import EventCard from '~/components/EventCard';
import { supabase } from '~/lib/supabase-client';
import type { IEvent, IEventPrice } from '~/models';
import { getEventPrice } from '~/models';
import signale from '../lib/logger.server';

export const loader : LoaderFunction = async ({ params }) => {
	const slug = params.slug as string;

	const { error, data: event } = await supabase
		.from<IEvent>('events')
		.select('*')
		.eq('slug', slug)
		.single()

	if ( error ) {
		signale.error(error)
		return redirect('/events', { status: 301 })
	}

	const eventPrice = await getEventPrice(event.id);

	if ( eventPrice.error ) {
		signale.error(eventPrice.error)
		return redirect('/', { status: 301 });
	}

	if (!event) {
		return redirect('/', { status: 301 })
	}

	return json({
		event,
		tier: eventPrice.data
	})
}

export default function EventDetail() {
	const data = useLoaderData<{ event: IEvent; tier: IEventPrice }>()
	console.log(data);


	return (
		<div>
			{data && <EventCard {...data} />}
		</div>
	)
}

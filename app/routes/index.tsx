import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useLoaderData } from '@remix-run/react';
import { format } from 'date-fns';
import Layout from '~/components/Layout';
import { supabase } from '~/lib/supabase-client';
import type { IEvent } from '~/models';

export const loader: LoaderFunction = async () => {
  const events = await supabase.from<IEvent>('events')
    .select('*')
    .gte('date', new Date().toISOString())
    .order('date', { ascending: true })

  if ( events.error ) {
    console.error(events.error)

    return redirect('/events')
  }

  if ( events.data.length === 1 ) {
    return json(events.data[0])
  }

  return json(events.data[0])
}

export const meta: MetaFunction = () => ({
	title: 'Flanda',
})

export default function Index() {
  const event = useLoaderData<IEvent | null>()

  if (!event) {
    return (
      <h1 className='text-5xl font-bold underline'>
        No upcoming events. :(
      </h1>
    )
  }

  return (
      <Layout>
          <Link to={`/events/${event.slug}`} className='hover:opacity-75 transition-all'>
            <div className='flex flex-col items-center justify-center gap-4 text-center'>
              <p className='text-3xl'>UPCOMING EVENT</p>
                <h1 className='text-5xl font-bold underline'>{event.title}</h1>
              <p className='text-2xl'>{format(new Date(event.date), 'Pp')}</p>
            </div>
          </Link>
      </Layout>
  );
}

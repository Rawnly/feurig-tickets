import { Form } from '@remix-run/react';
import type { FC, PropsWithChildren} from "react";
import { useMemo } from "react";
import React from "react";
import type { IEvent, IEventPrice } from '~/models';
import Button from './Button';

interface IEventCardProps {
	event: IEvent
	tier?: IEventPrice
}

const EventCard: FC<PropsWithChildren<IEventCardProps>> = ({ event: evt, tier = null }) => {
	const isSoldOut = useMemo(() => (evt?.sold_tickets >= evt?.total_tickets) ?? false, [evt])

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		if ( !isSoldOut ) return

		e.preventDefault()
		e.stopPropagation()

		console.warn('Event sold-out!')
	}

	return (
		<Form method='post' onSubmit={onSubmit} className='flex max-w-2xl gap-4'>
			<input type="hidden" name='eventId' value={evt?.id} />
			<div className='min-w-[300px]'>
				<img
					src={evt?.flyer_image_url ?? 'https://via.placeholder.com/300x300'}
					alt={evt?.slug}
					onError={({currentTarget}) => currentTarget.src = 'https://via.placeholder.com/200x200/000?text='+evt.slug}
					className='aspect-square w-[300px] h-[300px] bg-black'
				/>

				{/* Check if the event is enabled */}
				{evt?.enabled && (
					<Button
						type='submit'
						disabled={isSoldOut}
						theme='auto'
						className='w-full mt-2'
					>
						{isSoldOut ? 'SOLD OUT' : 'BUY TICKETS'}
					</Button>
				)}
			</div>
			<div className='flex flex-col gap-4'>
				<h2 className='text-3xl font-bold'>{evt?.title} {tier && '| ' + tier?.tier_name}</h2>
				<p className='text-codGray-800 dark:text-silver-300 text-sm leading-relaxed text-justify'>{evt?.description}</p>
			</div>
		</Form>
	)
}

EventCard.displayName = 'EventCard'

export default EventCard;

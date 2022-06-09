import { Form } from '@remix-run/react';
import type { FC, PropsWithChildren} from "react";
import { useMemo } from "react";
import React from "react";
import type { IEvent, IEventPrice, IFullEvent } from '~/models';
import Button from './Button';

interface IEventCardProps {
	event: IFullEvent

}

const EventCard: FC<PropsWithChildren<IEventCardProps>> = ({ event: evt }) => {
	const isSoldOut = useMemo(() => (evt?.tickets >= evt?.max_tickets) ?? false, [evt])

	const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		if ( !isSoldOut ) return

		e.preventDefault()
		e.stopPropagation()

		console.warn('Event sold-out!')
	}

	return (
		<Form method='post' onSubmit={onSubmit} className='flex w-full max-w-4xl gap-4'>
			<input type="hidden" name='eventId' value={evt?.id} />
			<img
				src={evt?.flyer_image_url ?? 'https://via.placeholder.com/300x300'}
				alt={evt?.slug}
				onError={({currentTarget}) => currentTarget.src = 'https://via.placeholder.com/200x200/000?text='+evt.slug}
				className='aspect-square min-w-[350px] h-[350px] bg-black'
			/>
			<div className='flex flex-col w-full'>
				<div className='mb-4'>
					<h2 className='text-3xl font-bold'>{evt?.title}</h2>
					{evt.tier_id && <i className='text-sm font-semibold'>"{evt.tier_name}"</i>}
				</div>
				<p className='text-codGray-800 dark:text-silver-300 text-sm leading-relaxed text-justify'>
					{evt?.description}
				</p>
				<div className='flex items-end justify-start flex-1 w-full mt-auto'>
					{evt?.enabled && (
						<Button
							type='submit'
							disabled={isSoldOut}
							theme='auto'
							className='mt-2'
						>
							{isSoldOut ? 'SOLD OUT' : 'BUY TICKETS'}
						</Button>
					)}
				</div>
			</div>
		</Form>
	)
}

EventCard.displayName = 'EventCard'

export default EventCard;

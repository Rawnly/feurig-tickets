import { Outlet, useLoaderData } from '@remix-run/react';
import type { FC, PropsWithChildren } from "react";

interface IEventLayoutProps { }

const EventLayout: FC<PropsWithChildren<IEventLayoutProps>> = (props) => {
	return (
		<div className='w-screen h-screen bg-codGray-900'>
			{/* Event Card */}
			<div className='fixed inset-0 sm:inset-5 md:left-5 rounded-lg p-8 md:max-w-xl bg-white'>
				{props.children}
			</div>
		</div>
	);
}

EventLayout.displayName = 'EventLayout'

export default EventLayout;

import { useOthers, useUpdateMyPresence } from '@liveblocks/react';
import { Link, useLocation } from '@remix-run/react';
import type { FC, PropsWithChildren } from "react";
import React, { useCallback } from "react";
import Cursor from './Cursor';

interface ILayoutProps {
}

type Presence = {
	connectionId: string
	cursor: {
		x: number
		y: number
	} | null;
	screen: {
		width: number
		height: number
	} | null;
}

const Layout: FC<PropsWithChildren<ILayoutProps>> = ( props ) => {
	const location = useLocation()

	const others = useOthers<Presence>()
	const updatePresence = useUpdateMyPresence<Presence>()
	const cursors = others
		.map( user => user.presence )
		.filter( ( presence ) => {
			if ( !presence || !presence.cursor || !presence.screen ) return false

			return presence.cursor.x <= window.innerWidth
				&& presence.cursor.y <= window.innerHeight
		} )

	const onPointerMove = useCallback( ( e ) => {
		updatePresence( {
			screen: {
				width: window.innerWidth,
				height: window.innerHeight
			},
			cursor: {
				x: Math.round( e.clientX ),
				y: Math.round( e.clientY )
			}
		} )
	}, [updatePresence] )

	const onPointerLeave = useCallback( () => {
		updatePresence( {
			cursor: null,
			screen: null
		} )
	}, [updatePresence] )

	return (
		<section
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
			className='grid w-screen min-h-screen p-8' style={{
				gridTemplateRows: '[nav] 100px [content] auto [footer] 80px',
				gridTemplateColumns: '[sidebar] 80px auto'
			}}
		>

			{cursors.map( ( presence, idx ) => presence ? (
				<Cursor
					x={presence.cursor?.x ?? 0}
					y={presence.cursor?.y ?? 0}
					key={idx}
				/>
			) : null )}
			<div
				style={{
					gridArea: 'nav',
					gridColumn: '1 / -1'
				}}
				className='flex items-start justify-center'
			>
				<Link
					to='/'
					className='hover:opacity-75 text-3xl font-bold text-center transition-opacity cursor-pointer'

				>
					FLANDA
				</Link>
			</div>


			<div
				className='flex flex-col items-start justify-start gap-6'
				style={{
					gridArea: 'sidebar',
					gridRow: '1 / -1',
				}}
			>

				{location.pathname !== '/' ? (
					<Link to='/' className='hover:underline uppercase' style={{ writingMode: 'vertical-rl' }}>
						Home
					</Link>
				) : (
					<Link to='/events' className='hover:underline uppercase' style={{ writingMode: 'vertical-rl' }}>
						ALL EVENTS
					</Link>
				)}
			</div>

			<div
				className='flex items-center justify-center'
				style={{
					gridArea: 'content',
					gridColumn: '1 / -1'
				}}
			>

				{props.children}
			</div>

		</section>
	)
}

Layout.displayName = 'Layout'

export default Layout;

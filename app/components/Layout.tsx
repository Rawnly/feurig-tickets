import { Link, useLocation } from '@remix-run/react';
import type { FC, PropsWithChildren } from "react";
import React from "react";

interface ILayoutProps { }

const Layout: FC<PropsWithChildren<ILayoutProps>> = (props) => {
	const location = useLocation()

	return (
        <section
			className='grid w-screen min-h-screen p-8' style={{
				gridTemplateRows: '[nav] 100px [content] auto [footer] 80px',
				gridTemplateColumns: '[sidebar] 80px auto'
			}}
		>
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

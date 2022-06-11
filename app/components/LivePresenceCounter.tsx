import { useOthers } from '@liveblocks/react';
import type { FC, PropsWithChildren } from "react";
import React from "react";

interface ILivePresenceCounterProps { }

const LivePresenceCounter: FC<PropsWithChildren<ILivePresenceCounterProps>> = (props) => {
	const others = useOthers()

	return (
		<div className='bottom-5 left-5 bg-codGray-900 dark:bg-silver-100 text-silver-100 fixed px-4 py-2 text-xs'>
			{
				others.count === 1
					? '1 other is watching'
					: `${others.count} others are watching`
			}
		</div>
	);
}

LivePresenceCounter.displayName = 'LivePresenceCounter'

export default LivePresenceCounter;

import { RoomProvider, useOthers, useUpdateMyPresence } from '@liveblocks/react';
import clsx from 'clsx';
import type { FC, PropsWithChildren } from "react";
import React, { useCallback } from "react";
import Cursor from './Cursor';

interface IRoomProps {
	id: string
	className?: string
}

const Room: FC<PropsWithChildren<IRoomProps>> = (props) => {

	return (
		<RoomProvider
			id={props.id}
			initialPresence={{
				cursor: {
					x: 0,
					y: 0
				}
			}}
		>
			<div
			>
				{props.children}
			</div>
		</RoomProvider>
	);
}

Room.displayName = 'Room'

export default Room;

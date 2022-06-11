import { faMousePointer } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useMemo } from 'react';

interface ICursorProps {
  x: number;
  y: number
}

const randomColors = ['#1B9CFC', '#25CCF7', '#FC427B', '#F97F51', '#2C3A47', '#7d5fff', '#4b4b4b']

const Cursor : React.FC<ICursorProps> = ({ x = 0, y = 0 }) => {
  const color = useMemo(() => randomColors[Math.floor(Math.random() * randomColors.length)], [])

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transition: 'all 0.5s cubic-bezier(.17, .93, .38, 1)',
        color,
        zIndex: 9999999999
      }}
    >
      <FontAwesomeIcon
        icon={faMousePointer}
        className='invert-0 text-lg transition-all duration-75'
      />
    </div>
  )
}

Cursor.displayName = 'Cursor'

export default Cursor

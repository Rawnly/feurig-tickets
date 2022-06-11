import React, { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMousePointer } from '@fortawesome/free-solid-svg-icons'

interface ICursorProps {
  x: number;
  y: number
}

const randomColors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink', 'brown', 'black']

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

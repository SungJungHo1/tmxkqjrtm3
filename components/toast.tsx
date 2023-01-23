import React, { useEffect, useState } from 'react'

const Toast = (props) => {
  const { message, open, onOpen, color, delay = 2000 } = props
  const [addClass, setAddClass] = useState('h-0')

  useEffect(() => {
    if (open) {
      setAddClass('h-14')
      onOpen?.(true)

      setTimeout(() => {
        setAddClass('h-0')
        onOpen?.(false)
      }, delay)
    }
  }, [open, delay])

  return (
    <div
      style={{ fontFamily: "Sriracha-Regular", fontSize: "14px" }}
      className={`${addClass} ${color === 'success' ? 'bg-[#009a04]' : 'bg-[#e23636]'
        } text-center leading-[3.5rem] text-white transition-all`}
    >
      {message}
    </div>
  )
}

export default Toast

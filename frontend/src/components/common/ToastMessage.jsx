import { useEffect, useRef } from 'react'
import './ToastMessage.css'

function ToastMessage({ message, duration = 2000, onClose, className = '' }) {
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!message) return undefined

    const timer = window.setTimeout(() => onCloseRef.current?.(), duration)
    return () => window.clearTimeout(timer)
  }, [duration, message])

  if (!message) return null

  return (
    <div className={`toast-message ${className}`.trim()} role="status">
      {message}
    </div>
  )
}

export default ToastMessage

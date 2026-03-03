import { useEffect } from 'react'

interface ToastProps {
  message: string | null
  onDismiss: () => void
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!message) {
      return
    }

    const dismissTimer = window.setTimeout(() => {
      onDismiss()
    }, 3000)

    return () => {
      window.clearTimeout(dismissTimer)
    }
  }, [message, onDismiss])

  if (!message) {
    return null
  }

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[80] max-w-sm rounded-md border border-border bg-card px-4 py-3 text-sm text-foreground shadow-sm"
      role="status"
      style={{
        animation: 'toast-lifecycle 3s ease-in-out forwards',
      }}
    >
      {message}
    </div>
  )
}

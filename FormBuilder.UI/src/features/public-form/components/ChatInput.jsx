import { useEffect, useRef, useState } from 'react'
import { Send, Star } from 'lucide-react'

export function ChatInput({ theme, block, onSubmit }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    setValue('')
    setError('')
    setTimeout(() => inputRef.current?.focus(), 30)
  }, [block?.id])

  if (!block) return null

  const d = block.data || {}
  const label = d.label || ''

  const handleSubmit = (submittedValue) => {
    const raw = submittedValue ?? value
    const trimmed = typeof raw === 'string' ? raw.trim() : raw
    if (d.required && (trimmed === '' || trimmed === null || trimmed === undefined)) {
      setError('This field is required')
      return
    }
    if (trimmed === '' || trimmed === null || trimmed === undefined) {
      setError('Please enter a value')
      return
    }
    if (block.type === 'email-input' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Enter a valid email')
      return
    }
    if (block.type === 'number-input' && Number.isNaN(Number(trimmed))) {
      setError('Enter a number')
      return
    }
    setError('')
    onSubmit(trimmed)
  }

  if (block.type === 'buttons-input') {
    return (
      <div className="mt-1">
        {label && (
          <p className="mb-2 text-xs" style={{ color: theme.text, opacity: 0.7 }}>
            {label}
          </p>
        )}
        <div className="flex flex-wrap justify-end gap-2">
          {(d.options || []).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSubmit(opt)}
              className="rounded-xl px-4 py-2 text-sm font-medium shadow-sm transition hover:opacity-90"
              style={{
                backgroundColor: theme.userBubbleBg,
                color: theme.userBubbleText,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (block.type === 'rating-input') {
    const max = d.max || 5
    return (
      <div className="mt-1">
        {label && (
          <p className="mb-2 text-xs" style={{ color: theme.text, opacity: 0.7 }}>
            {label}
          </p>
        )}
        <div className="flex justify-end gap-1">
          {Array.from({ length: max }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSubmit(i + 1)}
              aria-label={`Rate ${i + 1}`}
              className="grid h-10 w-10 place-items-center rounded-lg transition hover:opacity-80"
              style={{ backgroundColor: theme.botBubbleBg }}
            >
              <Star className="h-5 w-5" style={{ color: theme.userBubbleBg }} fill={theme.userBubbleBg} />
            </button>
          ))}
        </div>
      </div>
    )
  }

  const inputType =
    block.type === 'email-input' ? 'email' :
    block.type === 'number-input' ? 'number' :
    block.type === 'phone-input' ? 'tel' :
    block.type === 'date-input' ? 'date' :
    'text'

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        handleSubmit()
      }}
      className="mt-1"
    >
      {label && (
        <p className="mb-2 text-xs" style={{ color: theme.text, opacity: 0.7 }}>
          {label}
        </p>
      )}
      <div className="flex items-end justify-end gap-2">
        <div className="flex-1 md:max-w-md">
          <input
            ref={inputRef}
            type={inputType}
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError('')
            }}
            placeholder={d.placeholder || ''}
            className="w-full rounded-lg border-0 px-4 py-2.5 text-base outline-none focus:ring-2 md:text-sm"
            style={{
              backgroundColor: theme.inputBg,
              color: theme.inputText,
              boxShadow: error
                ? '0 0 0 2px #F55050'
                : '0 1px 3px rgba(0,0,0,0.1)',
            }}
          />
          {error && (
            <p className="mt-1 text-xs" style={{ color: '#F55050' }}>
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          aria-label="Send"
          className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-lg text-white shadow-sm transition hover:opacity-90"
          style={{ backgroundColor: theme.sendButton }}
        >
          <Send className="h-5 w-5" fill="currentColor" />
        </button>
      </div>
    </form>
  )
}

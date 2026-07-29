import { useEffect, useRef, useState } from 'react'
import { Modal } from './Modal.jsx'

export function PromptModal({
  open,
  onClose,
  onSubmit,
  title,
  label,
  placeholder,
  defaultValue = '',
  submitLabel = 'Save',
  submitBusy = false,
  validate,
}) {
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setValue(defaultValue)
      setError('')
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 30)
    }
  }, [open, defaultValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) {
      setError('This field is required')
      return
    }
    if (validate) {
      const problem = validate(trimmed)
      if (problem) {
        setError(problem)
        return
      }
    }
    onSubmit(trimmed)
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {label && (
          <label htmlFor="prompt-input" className="block text-sm text-white/90">
            {label}
          </label>
        )}
        <input
          ref={inputRef}
          id="prompt-input"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            if (error) setError('')
          }}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-[#141416] px-3 py-2.5 text-sm text-white placeholder:text-white/40 outline-none transition ${
            error
              ? 'border-[#F55050] focus:border-[#F55050]'
              : 'border-white/15 focus:border-white/40'
          }`}
        />
        {error && <p className="text-xs text-[#F55050]">{error}</p>}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitBusy}
            className="rounded-md border border-white/15 bg-transparent px-4 py-2 text-sm text-white/85 transition hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitBusy}
            className="rounded-md bg-[#1A5FFF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1653DD] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitBusy ? 'Saving...' : submitLabel}
          </button>
        </div>
      </form>
    </Modal>
  )
}

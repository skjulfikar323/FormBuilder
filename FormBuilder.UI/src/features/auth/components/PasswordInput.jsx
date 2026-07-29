import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export const PasswordInput = forwardRef(function PasswordInput(
  { className = '', errorClassName = '', hasError = false, ...props },
  ref
) {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <input
        ref={ref}
        type={show ? 'text' : 'password'}
        className={`${className} pr-11 ${hasError ? errorClassName : ''}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        tabIndex={-1}
        className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded text-white/60 transition hover:bg-white/5 hover:text-white"
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
})

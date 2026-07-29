import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAuthStore } from '@features/auth/store/authStore.js'
import { useLogout } from '@features/auth/hooks/useAuth.js'

export function WorkspaceHeader() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  const workspaceName = user?.fullName || user?.username || 'My'

  return (
    <header
      className="relative w-full border-b app-surface"
      style={{ borderColor: 'var(--app-border)' }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-5">
        <div ref={ref} className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md border px-4 py-1.5 text-sm font-medium transition app-surface-2 app-text"
            style={{ borderColor: 'var(--app-border-strong)' }}
            aria-expanded={open}
          >
            <span>{workspaceName}&apos;s workspace</span>
            {open ? (
              <ChevronUp className="h-4 w-4 opacity-70" />
            ) : (
              <ChevronDown className="h-4 w-4 opacity-70" />
            )}
          </button>

          {open && (
            <div
              className="absolute left-1/2 top-[calc(100%+4px)] z-40 w-44 -translate-x-1/2 overflow-hidden rounded-md border shadow-2xl app-surface-3"
              style={{ borderColor: 'var(--app-border)' }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  navigate('/dashboard/settings')
                }}
                className="block w-full px-4 py-2 text-left text-sm transition hover:opacity-80 app-text"
              >
                Settings
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  logout()
                }}
                className="block w-full px-4 py-2 text-left text-sm font-medium text-[#FF8B1A] transition hover:opacity-80"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

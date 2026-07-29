import toast from 'react-hot-toast'
import { useThemeStore } from '@features/theme/themeStore.js'
import { authApi } from '@features/auth/api/authApi.js'
import { THEME_LIST, getTheme } from '../themes.js'

export function ThemeTab() {
  const activeThemeId = useThemeStore((s) => s.themeId)
  const setTheme = useThemeStore((s) => s.setTheme)
  const theme = getTheme(activeThemeId)

  const handlePick = async (id) => {
    if (id === activeThemeId) return
    // Optimistic UI: apply locally first, then sync to server
    setTheme(id)
    toast.success(`${getTheme(id).label} theme applied`)
    try {
      await authApi.updatePreferences({ themeId: id })
    } catch {
      // silent — theme still applies locally
    }
  }

  return (
    <div className="flex flex-1 flex-col md:flex-row">
      <aside
        className="w-full flex-shrink-0 border-b px-4 py-5 md:h-full md:w-72 md:border-b-0 md:border-r md:px-5"
        style={{
          backgroundColor: 'var(--app-surface)',
          borderColor: 'var(--app-border)',
        }}
      >
        <h2 className="mb-1 text-sm font-semibold" style={{ color: 'var(--app-text)' }}>
          Customize the theme
        </h2>
        <p className="mb-4 text-xs" style={{ color: 'var(--app-text-dim)' }}>
          Applies to the whole app.
        </p>
        <div className="space-y-3">
          {THEME_LIST.map((t) => (
            <ThemeCard
              key={t.id}
              theme={t}
              active={t.id === activeThemeId}
              onClick={() => handlePick(t.id)}
            />
          ))}
        </div>
      </aside>

      <div className="flex-1 overflow-y-auto p-6 md:p-10" style={{ backgroundColor: theme.background }}>
        <ThemePreview theme={theme} />
      </div>
    </div>
  )
}

function ThemeCard({ theme, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full overflow-hidden rounded-lg border-2 text-left transition ${
        active ? 'border-[#1A5FFF]' : 'hover:opacity-90'
      }`}
      style={
        active
          ? undefined
          : { borderColor: 'var(--app-border-strong)' }
      }
    >
      <div
        className="flex flex-col gap-2 p-3"
        style={{ backgroundColor: theme.background }}
      >
        <MiniRow theme={theme} accent={theme.accent} />
        <MiniRow theme={theme} accent={theme.buttonBar} showButtons />
      </div>
      <div className="bg-black/60 px-3 py-1.5 text-xs font-medium text-white">
        {theme.label}
      </div>
    </button>
  )
}

function MiniRow({ theme, accent, showButtons = false }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className="h-3 w-3 flex-shrink-0 rounded-full"
        style={{ backgroundColor: theme.avatarBg }}
      />
      <span
        className="h-2 flex-1 rounded"
        style={{ backgroundColor: theme.botBubbleBg }}
      />
      <span
        className="h-2 w-14 rounded"
        style={{ backgroundColor: accent }}
      />
      {showButtons && (
        <>
          <span
            className="h-2 w-4 rounded"
            style={{ backgroundColor: theme.buttonBar }}
          />
          <span
            className="h-2 w-4 rounded"
            style={{ backgroundColor: theme.buttonBar }}
          />
        </>
      )}
    </div>
  )
}

function ThemePreview({ theme }) {
  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-start gap-2">
        <div
          className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full"
          style={{ backgroundColor: theme.avatarBg }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke={theme.avatarText}
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 12a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z" />
            <path d="m9 9 3 3 3-3" />
          </svg>
        </div>
        <div
          className="rounded-lg px-4 py-2 text-sm"
          style={{
            backgroundColor: theme.botBubbleBg,
            color: theme.botBubbleText,
          }}
        >
          Hello
        </div>
      </div>

      <div className="flex justify-end">
        <div
          className="rounded-lg px-4 py-2 text-sm font-medium"
          style={{
            backgroundColor: theme.userBubbleBg,
            color: theme.userBubbleText,
          }}
        >
          Hi
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'

export function LandingNavbar() {
  return (
    <header className="relative z-30 w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-10 md:py-6">
        <Link to="/" className="flex items-center gap-2 text-white">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-[#1A5FFF] font-bold">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="4" width="14" height="2" rx="1" fill="white" />
              <rect x="2" y="8" width="14" height="2" rx="1" fill="white" />
              <rect x="2" y="12" width="9" height="2" rx="1" fill="white" />
            </svg>
          </span>
          <span className="font-bold tracking-tight">FormBot</span>
        </Link>

        <nav className="flex items-center gap-2 md:gap-3">
          <Link
            to="/login"
            className="rounded-lg border border-[#1A5FFF] px-4 py-2 text-sm font-medium text-[#1A5FFF] transition hover:bg-[#1A5FFF]/10 md:px-5 md:py-2.5"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-[#1A5FFF] px-4 py-2 text-sm font-medium text-white shadow-[0_4px_10px_rgba(26,95,255,0.35)] transition hover:bg-[#1653DD] md:px-5 md:py-2.5"
          >
            Create a FormBot
          </Link>
        </nav>
      </div>
    </header>
  )
}

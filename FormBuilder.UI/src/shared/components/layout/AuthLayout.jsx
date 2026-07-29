import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function AuthLayout({ children }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#121212] text-white">
      <Link
        to="/"
        aria-label="Go back"
        className="absolute left-5 top-5 z-30 flex h-10 w-10 items-center justify-center rounded-full text-white/90 transition hover:bg-white/5 hover:text-white sm:left-10 sm:top-10"
      >
        <ArrowLeft className="h-5 w-5" strokeWidth={2.25} />
      </Link>

      <div
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-1/2 z-0 hidden -translate-y-1/2 md:block"
      >
        <svg
          width="380"
          height="360"
          viewBox="0 0 380 360"
          fill="none"
          className="drop-shadow-[0_20px_40px_rgba(249,115,22,0.25)]"
        >
          <polygon
            points="70,310 250,40 365,315"
            fill="#C2410C"
            opacity="0.85"
          />
          <polygon
            points="15,330 220,50 335,330"
            fill="#F97316"
          />
        </svg>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 top-[14%] z-0 h-[260px] w-[260px] rounded-full bg-[#FF9595] sm:h-[320px] sm:w-[320px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 right-[22%] z-0 h-[300px] w-[300px] rounded-full bg-[#FFBF7D] sm:h-[360px] sm:w-[360px]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 bottom-[8%] z-0 h-[180px] w-[180px] rounded-full bg-[#F97316] opacity-40 blur-2xl md:hidden"
      />

      <main className="relative z-10 flex min-h-screen items-center justify-center px-5 py-16 md:justify-end md:px-20 lg:pr-[22%]">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  )
}

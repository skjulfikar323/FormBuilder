import { Link } from 'react-router-dom'

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden px-5 py-20 md:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-4 top-8 z-0 hidden md:block"
      >
        <svg width="180" height="120" viewBox="0 0 180 120" fill="none">
          <polygon
            points="10,100 130,15 170,95"
            fill="#F97316"
            transform="rotate(-8, 90, 60)"
            className="drop-shadow-[0_15px_30px_rgba(249,115,22,0.35)]"
          />
        </svg>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-4 top-4 z-0 hidden md:block"
      >
        <svg width="190" height="170" viewBox="0 0 220 200" fill="none">
          <path
            d="M 30 180 Q 30 30 190 30 Q 190 100 190 180"
            stroke="#1A5FFF"
            strokeWidth="30"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 55 180 Q 55 55 190 55"
            stroke="#3B82F6"
            strokeWidth="18"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h3 className="text-2xl font-bold text-white md:text-3xl">
          Improve conversion and user engagement
          <br /> with FormBots
        </h3>
        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="rounded-lg bg-[#1A5FFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(26,95,255,0.4)] transition hover:bg-[#1653DD] md:text-base"
          >
            Create a FormBot
          </Link>
        </div>
        <p className="mt-3 text-xs text-white/50">
          No credit card required. Free plan available.
        </p>
      </div>
    </section>
  )
}

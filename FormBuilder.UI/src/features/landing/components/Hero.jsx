import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-5 py-16 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-8 top-6 z-0 hidden md:block"
      >
        <svg width="200" height="140" viewBox="0 0 200 140" fill="none">
          <polygon
            points="10,110 155,15 195,105"
            fill="#F97316"
            transform="rotate(-8, 100, 70)"
            className="drop-shadow-[0_15px_30px_rgba(249,115,22,0.35)]"
          />
        </svg>
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 top-10 z-0 hidden md:block"
      >
        <svg width="220" height="200" viewBox="0 0 220 200" fill="none">
          <path
            d="M 30 180 Q 30 30 190 30 Q 190 100 190 180"
            stroke="#1A5FFF"
            strokeWidth="34"
            strokeLinecap="round"
            fill="none"
            className="drop-shadow-[0_15px_30px_rgba(26,95,255,0.35)]"
          />
          <path
            d="M 55 180 Q 55 55 190 55"
            stroke="#3B82F6"
            strokeWidth="20"
            strokeLinecap="round"
            fill="none"
            opacity="0.7"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          <span className="text-[#1A5FFF]">Build advanced chatbots</span>
          <br />
          <span className="text-[#1A5FFF]">visually</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm text-white/70 md:text-base">
          Typebot gives you powerful blocks to create unique chat experiences.
          Embed them anywhere on your web/mobile apps and start collecting
          results like magic.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="rounded-lg bg-[#1A5FFF] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(26,95,255,0.4)] transition hover:bg-[#1653DD] md:text-base"
          >
            Create a FormBot &nbsp;for free
          </Link>
        </div>
      </div>
    </section>
  )
}

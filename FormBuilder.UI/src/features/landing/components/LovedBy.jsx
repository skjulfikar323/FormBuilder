const LOGOS = [
  'IBonFirst',
  'lem.list',
  'MakerLead',
  'WebSharp',
  'SOCIAL+CARS',
  'PINPOINT',
  'CIRCLE',
  'Awesomo',
]

export function LovedBy() {
  return (
    <section className="px-5 py-14">
      <div className="mx-auto max-w-5xl">
        <h4 className="text-center text-lg font-semibold text-white md:text-xl">
          Loved by teams and creators from all around the world
        </h4>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {LOGOS.map((l) => (
            <div
              key={l}
              className="grid h-14 place-items-center rounded-lg bg-white/[0.03] text-sm font-semibold text-white/60"
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

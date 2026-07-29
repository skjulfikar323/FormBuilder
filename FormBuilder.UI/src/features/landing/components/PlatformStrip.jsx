const PLATFORMS = ['Astro', 'Notion', 'JS', 'WordPress', 'React', 'Vue']
const INTEGRATIONS = ['Chat', 'Sheets', 'Zapier', 'Mailchimp', 'Webhook']

export function PlatformStrip() {
  return (
    <section className="px-5 py-10 md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-4 opacity-90 md:gap-8">
          {PLATFORMS.map((p) => (
            <div
              key={p}
              className="grid h-14 w-14 place-items-center rounded-lg bg-white/5 text-xs font-semibold text-white/70"
            >
              {p}
            </div>
          ))}
        </div>

        <div className="mb-3 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {INTEGRATIONS.map((p) => (
            <div
              key={p}
              className="grid h-12 w-12 place-items-center rounded-md bg-white/5 text-[10px] font-medium text-white/60"
            >
              {p}
            </div>
          ))}
        </div>

        <h4 className="mt-6 text-center text-xl font-bold text-white md:text-2xl">
          Integrate with any platform
        </h4>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-white/70">
          Typebot offers several native integration blocks as well as
          instructions on how to embed typebot on particular platforms.
        </p>
      </div>
    </section>
  )
}

export function EmbedSection() {
  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h3 className="text-2xl font-bold text-white md:text-3xl">
            Embed it in a click
          </h3>
          <p className="mt-4 text-sm text-white/70 md:text-base">
            Embedding your typebot in your applications is a walk in the park.
            Typebot gives you several step-by-step platform-specific
            instructions. Your typebot will always feel &quot;native&quot;.
          </p>
        </div>

        <div className="relative">
          <div className="rounded-2xl border-8 border-slate-200 bg-slate-100 p-3 shadow-2xl">
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-white p-3">
              <div>
                <div className="mb-2 text-[10px] font-semibold text-slate-800">
                  Awesome
                </div>
                <div className="mb-3 text-[9px] leading-snug text-slate-500">
                  It&apos;s time to amplify your online business
                </div>
                <button className="rounded bg-[#1A5FFF] px-2 py-1 text-[9px] font-medium text-white">
                  Learn more
                </button>
              </div>
              <div className="aspect-video rounded bg-gradient-to-br from-orange-200 via-orange-400 to-orange-600" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

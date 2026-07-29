const BLOCKS = [
  { group: 'Bubbles', items: ['Text', 'Image', 'Video'] },
  { group: 'Inputs', items: ['Number', 'Email', 'Website', 'Date', 'Phone'] },
]

export function FeatureHighlight() {
  return (
    <section className="px-5 py-12 md:px-10 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2 md:items-center">
        <div className="order-2 md:order-1">
          <div className="relative overflow-hidden rounded-xl border-4 border-[#1A5FFF] bg-white p-4 shadow-2xl">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded border border-slate-200 bg-slate-50 p-2">
                <div className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Bubbles
                </div>
                <div className="space-y-1">
                  {BLOCKS[0].items.map((b) => (
                    <div
                      key={b}
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700"
                    >
                      {b}
                    </div>
                  ))}
                </div>
                <div className="mt-3 mb-1 text-[9px] font-semibold uppercase tracking-wider text-slate-500">
                  Inputs
                </div>
                <div className="space-y-1">
                  {BLOCKS[1].items.map((b) => (
                    <div
                      key={b}
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] text-slate-700"
                    >
                      {b}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="rounded border border-slate-200 bg-slate-50 p-2 text-[10px] text-slate-700">
                  <div className="mb-1 font-semibold">Block #1</div>
                  <div className="mb-1 rounded bg-white px-2 py-1 text-slate-500">Hello!</div>
                  <div className="mb-1 rounded bg-white px-2 py-1 text-slate-500">
                    What&apos;s your name?
                  </div>
                  <div className="rounded bg-white px-2 py-1 text-slate-400 italic">
                    Text
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <h3 className="text-2xl font-bold text-white md:text-3xl">
            Easy building experience
          </h3>
          <p className="mt-4 text-sm text-white/70 md:text-base">
            All you have to do is drag and drop blocks to create your app. Even
            if you have custom needs, you can always add custom code.
          </p>
        </div>
      </div>
    </section>
  )
}

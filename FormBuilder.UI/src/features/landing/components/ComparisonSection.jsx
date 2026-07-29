import { X, Check } from 'lucide-react'

export function ComparisonSection() {
  return (
    <section className="px-5 py-16 md:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-bold leading-tight text-white md:text-4xl">
          Replace your old school forms
          <br /> with
          <br /> <span className="text-white">chatbots</span>
        </h2>
        <p className="mx-auto mt-6 max-w-3xl text-center text-sm text-white/70 md:text-base">
          Typebot is a better way to ask for information. It leads to an
          increase in customer satisfaction and retention and multiply by 3 your
          conversion rate compared to classical forms.
        </p>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col items-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#EF4444]/90 shadow-lg">
              <X className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div className="mt-4 w-full rounded-lg border border-white/10 bg-black/30 p-5">
              <div className="mb-1 text-xs text-white/90">
                Full name <span className="text-red-400">*</span>
              </div>
              <div className="mb-3 h-8 rounded border border-white/20 bg-transparent px-2 text-[10px] leading-8 text-white/40">
                Full name
              </div>
              <div className="mb-1 text-xs text-white/90">
                Email <span className="text-red-400">*</span>
              </div>
              <div className="mb-3 h-8 rounded border border-white/20 bg-transparent px-2 text-[10px] leading-8 text-white/40">
                Email
              </div>
              <div className="mb-1 text-xs text-white/90">
                What services are you interested in?{' '}
                <span className="text-red-400">*</span>
              </div>
              <div className="mb-3 space-y-1 text-xs text-white/70">
                {['Website Dev', 'Content Marketing', 'Social Media', 'UX/UI Design'].map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded border border-white/40" />
                    <span>{s}</span>
                  </label>
                ))}
              </div>
              <div className="mb-1 text-xs text-white/90">
                Additional Information <span className="text-red-400">*</span>
              </div>
              <div className="mb-3 h-14 rounded border border-white/20 bg-transparent px-2 py-1 text-[10px] text-white/40">
                Additional Information
              </div>
              <button
                type="button"
                className="rounded bg-[#1A5FFF] px-3 py-1.5 text-xs font-medium text-white"
              >
                Submit
              </button>
            </div>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[#22C55E] shadow-lg">
              <Check className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div
              aria-hidden
              className="absolute -top-4 right-2 hidden text-xs italic text-white/90 md:block"
            >
              <span className="mr-1">Try it out!</span>
              <span className="inline-block">↴</span>
            </div>

            <div className="mt-4 w-full rounded-lg border border-white/10 bg-black/30 p-5">
              <div className="mb-3 text-xs text-white/70">
                Welcome to <span className="font-semibold text-white">AA</span>{' '}
                (Awesome Agency)
              </div>
              <div className="mb-3 aspect-video overflow-hidden rounded bg-gradient-to-br from-red-900 via-red-700 to-orange-600">
                <div className="flex h-full items-end justify-center p-3 text-2xl font-bold italic text-white">
                  WELCOME!
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 flex-shrink-0 rounded-full bg-orange-400" />
                <div className="ml-auto rounded-lg bg-[#1A5FFF] px-3 py-1.5 text-xs text-white">
                  Hi!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

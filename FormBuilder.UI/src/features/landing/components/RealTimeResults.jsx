export function RealTimeResults() {
  return (
    <section className="px-5 py-12 md:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h3 className="text-2xl font-bold text-white md:text-3xl">
          Collect results in real-time
        </h3>
        <p className="mt-3 text-sm text-white/70 md:text-base">
          One of the main advantages of a chat application is that you collect
          the user&apos;s response on each question. You won&apos;t lose any
          valuable data.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-start gap-2">
            <div className="h-8 w-8 flex-shrink-0 rounded-full bg-gradient-to-br from-orange-400 to-red-500" />
            <div className="flex-1 space-y-1.5 rounded-lg bg-white/5 p-3 text-left text-xs text-white/80">
              <p>
                As you answer this chat, you&apos;ll see your result in the real
                answer spreadsheet.
              </p>
              <p>You can think of it as a guestbook.</p>
              <p>Ready?</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="rounded-md bg-[#1A5FFF] px-4 py-1.5 text-xs font-medium text-white">
              Yes!
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

const BLOCKS = [
  { group: 'Bubbles', items: ['Text', 'Image', 'Video', 'Embed'] },
  { group: 'Inputs', items: ['Text', 'Number', 'Email', 'Website', 'Date', 'Phone', 'Button'] },
  { group: 'Logic', items: ['Set variable', 'Condition', 'Redirect', 'Code', 'Typebot'] },
  { group: 'Integrations', items: ['Sheets', 'Analytics', 'Webhook', 'Email', 'Zapier', 'Make.com', 'Pabbly'] },
]

const FLOW_NODES = [
  { title: 'Menu', color: '#F97316', items: ['Hey friend 👋', 'How can I help you?'] },
  { title: 'Bug', color: '#EF4444', items: ['Shoot! 😅', 'Can you describe the bug with as many details as possible?'] },
  { title: 'Group #7', color: '#3B82F6', items: ['Email is set', 'Default'] },
  { title: 'Bye', color: '#22C55E', items: ['Thank you for your submission ❤️', "I'll get back to you ASAP (usually within 24 hours)"] },
]

export function ProductPreview() {
  return (
    <section className="relative px-5 pb-16 md:px-10 md:pb-24">
      <div className="mx-auto max-w-6xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white shadow-[0_30px_80px_rgba(26,95,255,0.15)]">
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 md:px-6">
            <div className="flex items-center gap-2 text-xs text-slate-700">
              <span className="text-slate-400">&lt;</span>
              <span className="rounded bg-slate-100 px-2 py-1">😄 Customer Support</span>
              <span className="text-slate-400">···</span>
            </div>
            <div className="hidden items-center gap-3 text-xs font-medium md:flex">
              <span className="text-[#1A5FFF] border-b-2 border-[#1A5FFF] pb-1">Flow</span>
              <span className="text-slate-500">Theme</span>
              <span className="text-slate-500">Settings</span>
              <span className="text-slate-500">Share</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded border border-slate-200 px-3 py-1 text-slate-600">Preview</span>
              <span className="rounded bg-[#1A5FFF] px-3 py-1 font-medium text-white">Publish</span>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-0">
            <aside className="col-span-12 border-b border-slate-200 bg-slate-50/70 p-3 md:col-span-3 md:border-b-0 md:border-r">
              {BLOCKS.map((section) => (
                <div key={section.group} className="mb-3">
                  <div className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    {section.group}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {section.items.map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-1.5 rounded border border-slate-200 bg-white px-2 py-1.5 text-[10px] text-slate-700"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-[#1A5FFF]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </aside>

            <div className="col-span-12 bg-[#F7F8FF] p-6 md:col-span-9">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {FLOW_NODES.map((node) => (
                  <div
                    key={node.title}
                    className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                  >
                    <div className="mb-2 flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: node.color }}
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        {node.title}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {node.items.map((item, i) => (
                        <div
                          key={i}
                          className="rounded border border-slate-100 bg-slate-50 px-2 py-1 text-[10px] text-slate-600"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

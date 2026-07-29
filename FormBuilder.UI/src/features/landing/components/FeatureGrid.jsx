import { EyeOff, Users, Code2, FolderCog, Link2 } from 'lucide-react'

const FEATURES = [
  {
    icon: EyeOff,
    title: 'Hidden fields',
    body: 'Include data in your form URL to segment users and populate personalized fields.',
  },
  {
    icon: Users,
    title: 'Team collaboration',
    body: 'Invite your coworkers to work on your typebots with you.',
  },
  {
    icon: Link2,
    title: 'Link to sub-typebots',
    body: 'Reuse typebots in different typebots as a building block.',
  },
  {
    icon: Code2,
    title: 'Custom code',
    body: 'Customize everything with your own JavaScript & CSS code.',
  },
  {
    icon: FolderCog,
    title: 'Custom domain',
    body: 'Connect your typebot to the custom domain of your choice.',
  },
  {
    icon: FolderCog,
    title: 'Folder management',
    body: 'Organize your typebots into folders to keep it clean and easy to find.',
  },
]

export function FeatureGrid() {
  return (
    <section className="px-5 py-14 md:py-20">
      <div className="mx-auto max-w-6xl">
        <h3 className="text-center text-2xl font-bold text-white md:text-3xl">
          And many more features
        </h3>
        <p className="mt-2 text-center text-sm text-white/60">
          Typebot makes form building easy and comes with several killer
          features.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#1A5FFF]/40 hover:bg-white/[0.05]"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-[#1A5FFF]/15 text-[#789DF1]">
                <f.icon className="h-5 w-5" />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-white">
                {f.title}
              </h4>
              <p className="mt-1.5 text-xs text-white/60">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

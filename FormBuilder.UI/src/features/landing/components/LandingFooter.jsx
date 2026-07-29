const COLS = [
  {
    heading: 'Made with by Blocss',
    items: [],
  },
  {
    heading: 'Product',
    items: ['Status', 'Documentation', 'Roadmap', 'Pricing'],
  },
  {
    heading: 'Community',
    items: ['Discord', 'GitHub repository', 'Twitter', 'LinkedIn', 'OSS Friends'],
  },
  {
    heading: 'Company',
    items: ['About', 'Contact', 'Terms of Service', 'Privacy Policy'],
  },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 px-5 py-10 md:px-10">
      <div className="mx-auto grid max-w-6xl gap-8 text-sm md:grid-cols-4">
        {COLS.map((col) => (
          <div key={col.heading}>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-white/80">
              {col.heading}
            </div>
            {col.items.length > 0 && (
              <ul className="space-y-1.5 text-xs text-white/50">
                {col.items.map((i) => (
                  <li key={i} className="cursor-pointer transition hover:text-white/90">
                    {i}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
      <div className="mx-auto mt-8 max-w-6xl border-t border-white/5 pt-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} FormBot. All rights reserved.
      </div>
    </footer>
  )
}

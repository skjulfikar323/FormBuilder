import { Plus } from 'lucide-react'

export function CreateTypebotCard({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-lg bg-[#1A5FFF] text-white transition hover:bg-[#1653DD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A5FFF]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#121212]"
    >
      <Plus className="h-10 w-10" strokeWidth={2.5} />
      <span className="text-sm font-medium">Create a typebot</span>
    </button>
  )
}

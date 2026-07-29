import { Trash2, FolderClosed } from 'lucide-react'

export function FolderChip({ folder, active = false, onOpen, onDelete }) {
  return (
    <div
      className={`group flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition ${
        active
          ? 'border-[#1A5FFF]/60 bg-[#1A5FFF]/15 text-white'
          : 'border-white/10 bg-[#252528] text-white/90 hover:border-white/20 hover:bg-[#2E2E32]'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-2 outline-none"
      >
        <FolderClosed className="h-3.5 w-3.5 text-white/60" />
        <span className="max-w-[160px] truncate">{folder.name}</span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.(folder.id)
        }}
        aria-label={`Delete ${folder.name}`}
        className="grid h-5 w-5 place-items-center text-[#F55050] transition hover:text-[#FF6B6B]"
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  )
}

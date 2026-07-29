import { Trash2 } from 'lucide-react'

export function FormCard({ form, onOpen, onDelete }) {
  return (
    <div className="group relative">
      <button
        type="button"
        onClick={() => onOpen?.(form)}
        className="flex aspect-[4/5] w-full flex-col items-center justify-center rounded-lg bg-[#7A7A7A] text-white transition hover:bg-[#8A8A8A]"
      >
        <span className="px-4 text-center text-sm font-medium">
          {form.name}
        </span>
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.(form.id)
        }}
        aria-label={`Delete ${form.name}`}
        className="absolute right-2 top-2 grid h-6 w-6 place-items-center text-[#F55050] transition hover:text-[#FF6B6B]"
      >
        <Trash2 className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  )
}

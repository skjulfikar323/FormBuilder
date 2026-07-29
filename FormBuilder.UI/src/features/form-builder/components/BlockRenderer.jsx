import { Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { getBlockMeta, getBlockGroup } from '../blockTypes.js'

export function BlockRenderer({ block, onUpdate, onRemove, onMove, isFirst, isLast }) {
  const meta = getBlockMeta(block.type)
  const group = getBlockGroup(block.type)
  const isBubble = group === 'bubble'
  const isEmpty = isBlockEmpty(block)

  const accent = isBubble ? '#789DF1' : '#E67200'

  return (
    <div
      className={`group relative w-full rounded-lg border p-4 shadow-lg transition ${
        isEmpty
          ? 'border-[#F55050]/60 bg-[#F55050]/5'
          : 'border-white/10 bg-[#1E1E22] hover:border-white/25'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        {meta?.icon && (
          <meta.icon className="h-4 w-4" style={{ color: accent }} />
        )}
        <span className="text-sm font-semibold text-white">{meta?.label}</span>

        <div className="ml-auto flex items-center gap-1">
          <div className="hidden items-center gap-1 opacity-0 transition group-hover:opacity-100 md:flex">
            <button
              type="button"
              disabled={isFirst}
              onClick={() => onMove('up')}
              className="grid h-6 w-6 place-items-center rounded text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Move up"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              disabled={isLast}
              onClick={() => onMove('down')}
              className="grid h-6 w-6 place-items-center rounded text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="Move down"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label="Delete block"
            className="grid h-7 w-7 place-items-center rounded bg-[#F55050]/15 text-[#F55050] transition hover:bg-[#F55050]/25"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <BlockEditor block={block} onUpdate={onUpdate} />

      {isEmpty && (
        <p className="mt-2 text-xs text-[#F55050]">Required field</p>
      )}
    </div>
  )
}

function isBlockEmpty(block) {
  const d = block.data || {}
  switch (block.type) {
    case 'text-bubble':
      return !d.content?.trim()
    case 'image-bubble':
    case 'video-bubble':
    case 'gif-bubble':
      return !d.url?.trim()
    default:
      return false
  }
}

function BlockEditor({ block, onUpdate }) {
  const d = block.data || {}

  switch (block.type) {
    case 'text-bubble':
      return (
        <textarea
          value={d.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          placeholder="Click here to edit"
          rows={2}
          className="w-full resize-none rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
      )
    case 'image-bubble':
    case 'video-bubble':
    case 'gif-bubble':
      return (
        <input
          type="url"
          value={d.url || ''}
          onChange={(e) => onUpdate({ url: e.target.value })}
          placeholder="Click to add link"
          className="w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
        />
      )
    case 'text-input':
    case 'number-input':
    case 'email-input':
    case 'phone-input':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={d.label || ''}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Field label"
            className="w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
          />
          <input
            type="text"
            value={d.placeholder || ''}
            onChange={(e) => onUpdate({ placeholder: e.target.value })}
            placeholder="Placeholder"
            className="w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
          />
          <RequiredToggle value={d.required} onChange={(v) => onUpdate({ required: v })} />
        </div>
      )
    case 'date-input':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={d.label || ''}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Field label"
            className="w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
          />
          <RequiredToggle value={d.required} onChange={(v) => onUpdate({ required: v })} />
        </div>
      )
    case 'rating-input':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={d.label || ''}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Field label"
            className="w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
          />
          <div className="flex items-center gap-2 text-xs text-white/60">
            <span>Max:</span>
            <input
              type="number"
              min={1}
              max={10}
              value={d.max ?? 5}
              onChange={(e) => onUpdate({ max: Number(e.target.value) || 5 })}
              className="w-16 rounded border border-white/10 bg-[#141416] px-2 py-1 text-sm text-white"
            />
          </div>
          <RequiredToggle value={d.required} onChange={(v) => onUpdate({ required: v })} />
        </div>
      )
    case 'buttons-input':
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={d.label || ''}
            onChange={(e) => onUpdate({ label: e.target.value })}
            placeholder="Question"
            className="w-full rounded-md border border-white/10 bg-[#141416] px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:border-white/30"
          />
          <div className="space-y-1.5">
            {(d.options || []).map((opt, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={opt}
                  onChange={(e) => {
                    const next = [...(d.options || [])]
                    next[i] = e.target.value
                    onUpdate({ options: next })
                  }}
                  className="flex-1 rounded-md border border-white/10 bg-[#141416] px-3 py-1.5 text-sm text-white outline-none focus:border-white/30"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = (d.options || []).filter((_, idx) => idx !== i)
                    onUpdate({ options: next })
                  }}
                  className="grid h-6 w-6 place-items-center rounded text-white/50 hover:bg-white/10 hover:text-white"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                onUpdate({
                  options: [...(d.options || []), `Option ${(d.options || []).length + 1}`],
                })
              }
              className="text-xs text-[#1A5FFF] hover:underline"
            >
              + Add option
            </button>
          </div>
          <RequiredToggle value={d.required} onChange={(v) => onUpdate({ required: v })} />
        </div>
      )
    default:
      return null
  }
}

function RequiredToggle({ value, onChange }) {
  return (
    <label className="flex items-center gap-2 text-xs text-white/70">
      <input
        type="checkbox"
        checked={!!value}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-white/20 bg-transparent"
      />
      Required
    </label>
  )
}

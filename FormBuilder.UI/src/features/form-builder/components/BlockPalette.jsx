import { BUBBLE_BLOCKS, INPUT_BLOCKS } from '../blockTypes.js'

export function BlockPalette({ onPick }) {
  return (
    <aside
      className="w-full flex-shrink-0 border-b px-4 py-4 md:h-full md:w-64 md:border-b-0 md:border-r app-surface"
      style={{ borderColor: 'var(--app-border)' }}
    >
      <PaletteGroup
        title="Bubbles"
        color="#789DF1"
        items={BUBBLE_BLOCKS}
        onPick={onPick}
      />
      <PaletteGroup
        title="Inputs"
        color="#E67200"
        items={INPUT_BLOCKS}
        onPick={onPick}
      />
    </aside>
  )
}

function PaletteGroup({ title, color, items, onPick }) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/70">
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => (
          <button
            key={item.type}
            type="button"
            onClick={() => onPick(item.type)}
            className="flex items-center gap-2 rounded-md border border-white/10 bg-[#1F1F22] px-2.5 py-2 text-left text-xs text-white/90 transition hover:border-white/25 hover:bg-[#26262A]"
          >
            <item.icon
              className="h-3.5 w-3.5 flex-shrink-0"
              style={{ color }}
            />
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

import { Flag } from 'lucide-react'
import { BlockRenderer } from './BlockRenderer.jsx'

export function FlowCanvas({ form, onUpdateBlock, onRemoveBlock, onMoveBlock }) {
  const blocks = form.blocks || []

  return (
    <div className="app-bg flex-1 overflow-y-auto p-6 md:p-10">
      <div className="mx-auto flex max-w-2xl flex-col items-start gap-4">
        <div className="flex w-full max-w-md items-center gap-2 self-center rounded-lg border border-white/10 bg-[#1E1E22] px-4 py-3 text-sm font-medium text-white shadow-lg">
          <Flag className="h-4 w-4 text-white/70" fill="currentColor" />
          Start
        </div>

        {blocks.length === 0 ? (
          <p className="w-full pt-4 text-center text-xs text-white/40">
            Pick a block from the palette to add it to your form.
          </p>
        ) : (
          blocks.map((block, index) => (
            <div key={block.id} className="flex w-full max-w-md flex-col items-center gap-2 self-center">
              <span className="h-6 w-px bg-white/15" aria-hidden />
              <BlockRenderer
                block={block}
                onUpdate={(patch) => onUpdateBlock(block.id, patch)}
                onRemove={() => onRemoveBlock(block.id)}
                onMove={(dir) => onMoveBlock(block.id, dir)}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
              />
            </div>
          ))
        )}
      </div>
    </div>
  )
}

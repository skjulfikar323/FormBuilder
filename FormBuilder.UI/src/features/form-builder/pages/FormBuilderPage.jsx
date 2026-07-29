import { useState, useMemo } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useForm, useUpdateForm } from '@features/dashboard/hooks/useForms.js'
import { FormBuilderTopbar } from '../components/FormBuilderTopbar.jsx'
import { BlockPalette } from '../components/BlockPalette.jsx'
import { FlowCanvas } from '../components/FlowCanvas.jsx'
import { ThemeTab } from '../components/ThemeTab.jsx'
import { ResponseTab } from '../components/ResponseTab.jsx'

function genBlockId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1e6).toString(36)}`
}

function defaultDataForType(type) {
  switch (type) {
    case 'text-bubble': return { content: '' }
    case 'image-bubble':
    case 'video-bubble':
    case 'gif-bubble': return { url: '' }
    case 'text-input': return { label: 'Text', placeholder: 'Type your answer...', required: false }
    case 'number-input': return { label: 'Number', placeholder: 'Enter a number', required: false }
    case 'email-input': return { label: 'Email', placeholder: 'you@example.com', required: false }
    case 'phone-input': return { label: 'Phone', placeholder: '+1 555 000 0000', required: false }
    case 'date-input': return { label: 'Date', required: false }
    case 'rating-input': return { label: 'Rating', max: 5, required: false }
    case 'buttons-input': return { label: 'Pick an option', options: ['Option 1', 'Option 2'], required: false }
    default: return {}
  }
}

export function FormBuilderPage() {
  const { formId } = useParams()
  const { data: form, isLoading, error } = useForm(formId)
  const updateForm = useUpdateForm()

  const [activeTab, setActiveTab] = useState('Flow')

  const blocks = useMemo(() => form?.blocks || [], [form?.blocks])

  const patchBlocks = (nextBlocks) => {
    updateForm.mutate({ id: formId, blocks: nextBlocks })
  }

  const addBlock = (type) => {
    const newBlock = { id: genBlockId(), type, data: defaultDataForType(type) }
    patchBlocks([...blocks, newBlock])
  }

  const removeBlock = (blockId) => {
    patchBlocks(blocks.filter((b) => b.id !== blockId))
  }

  const updateBlockData = (blockId, patch) => {
    patchBlocks(
      blocks.map((b) =>
        b.id === blockId ? { ...b, data: { ...b.data, ...patch } } : b
      )
    )
  }

  const moveBlock = (blockId, direction) => {
    const i = blocks.findIndex((b) => b.id === blockId)
    if (i < 0) return
    const j = direction === 'up' ? i - 1 : i + 1
    if (j < 0 || j >= blocks.length) return
    const next = [...blocks]
    ;[next[i], next[j]] = [next[j], next[i]]
    patchBlocks(next)
  }

  if (isLoading) {
    return (
      <div className="grid min-h-screen place-items-center app-bg app-text">
        <p className="text-sm opacity-70">Loading form…</p>
      </div>
    )
  }
  if (error || !form) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="app-bg app-text flex min-h-screen flex-col">
      <FormBuilderTopbar
        form={form}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      <div className="flex flex-1 flex-col md:flex-row">
        {activeTab === 'Flow' && (
          <>
            <BlockPalette onPick={addBlock} />
            <FlowCanvas
              form={form}
              onUpdateBlock={updateBlockData}
              onRemoveBlock={removeBlock}
              onMoveBlock={moveBlock}
            />
          </>
        )}

        {activeTab === 'Theme' && <ThemeTab form={form} />}
        {activeTab === 'Response' && <ResponseTab form={form} />}
      </div>
    </div>
  )
}

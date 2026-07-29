import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useUpdateForm } from '@features/dashboard/hooks/useForms.js'

const TABS = ['Flow', 'Theme', 'Response']

export function FormBuilderTopbar({ form, activeTab, onTabChange }) {
  const [name, setName] = useState(form.name || '')
  const updateForm = useUpdateForm()
  const navigate = useNavigate()

  useEffect(() => setName(form.name || ''), [form.name])

  const commitName = () => {
    const trimmed = name.trim()
    if (trimmed && trimmed !== form.name) {
      updateForm.mutate(
        { id: form.id, name: trimmed },
        { onSuccess: () => toast.success('Name saved') }
      )
    } else if (!trimmed) {
      setName(form.name)
    }
  }

  const hasBlocks = (form.blocks || []).length > 0

  const handleShare = () => {
    if (!hasBlocks) {
      toast('Add at least one block before sharing', { icon: 'ℹ️' })
      return
    }
    const url = `${window.location.origin}/f/${form.id}`
    navigator.clipboard
      ?.writeText(url)
      .then(() => toast.success('Link copied'))
      .catch(() => toast('Link: ' + url))
  }

  const handleSave = () => {
    toast.success('Saved')
  }

  const handleClose = () => navigate('/dashboard')

  return (
    <header
      className="sticky top-0 z-30 border-b app-surface"
      style={{ borderColor: 'var(--app-border)' }}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 md:px-8">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur()
          }}
          placeholder="Enter Form Name"
          className="min-w-[140px] max-w-[220px] flex-1 rounded-md border px-3 py-1.5 text-sm outline-none transition app-surface-2 app-text"
          style={{ borderColor: 'var(--app-border-strong)' }}
        />

        <nav className="hidden gap-1 md:flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                activeTab === tab
                  ? 'border border-[#1A5FFF] text-[#1A5FFF]'
                  : 'app-text-muted hover:opacity-90'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className={`rounded-md px-4 py-1.5 text-sm font-medium text-white transition ${
              hasBlocks
                ? 'bg-[#1A5FFF] hover:bg-[#1653DD]'
                : 'bg-[#3F3F46] hover:bg-[#4A4A52]'
            }`}
            title={hasBlocks ? 'Copy shareable link' : 'Add a block to enable sharing'}
          >
            Share
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="rounded-md bg-[#4ADE80] px-4 py-1.5 text-sm font-medium text-black transition hover:bg-[#22C55E]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleClose}
            aria-label="Close"
            className="grid h-8 w-8 place-items-center rounded-md text-[#F55050] transition hover:bg-[#F55050]/15"
          >
            <X className="h-5 w-5" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      <nav className="flex gap-1 border-t border-white/5 px-4 py-2 md:hidden">
        {TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition ${
              activeTab === tab
                ? 'border border-[#1A5FFF] text-[#1A5FFF]'
                : 'text-white/70'
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </header>
  )
}

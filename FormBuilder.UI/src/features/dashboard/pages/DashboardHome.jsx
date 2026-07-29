import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FolderPlus } from 'lucide-react'
import { useWorkspaceStore } from '../store/workspaceStore.js'
import { useFolders, useCreateFolder, useDeleteFolder } from '../hooks/useFolders.js'
import { useForms, useCreateForm, useDeleteForm } from '../hooks/useForms.js'
import { FolderChip } from '../components/FolderChip.jsx'
import { FormCard } from '../components/FormCard.jsx'
import { CreateTypebotCard } from '../components/CreateTypebotCard.jsx'
import { PromptModal } from '@shared/components/ui/PromptModal.jsx'
import { ConfirmModal } from '@shared/components/ui/ConfirmModal.jsx'

export function DashboardHome() {
  const navigate = useNavigate()
  const activeFolderId = useWorkspaceStore((s) => s.activeFolderId)
  const setActiveFolder = useWorkspaceStore((s) => s.setActiveFolder)

  const { data: folders = [], isLoading: foldersLoading } = useFolders()
  const { data: forms = [], isLoading: formsLoading } = useForms(activeFolderId)

  const createFolder = useCreateFolder()
  const deleteFolder = useDeleteFolder()
  const createForm = useCreateForm()
  const deleteForm = useDeleteForm()

  const [folderPromptOpen, setFolderPromptOpen] = useState(false)
  const [formPromptOpen, setFormPromptOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const handleCreateFolder = (name) => {
    createFolder.mutate(
      { name },
      { onSuccess: () => setFolderPromptOpen(false) }
    )
  }

  const handleCreateForm = (name) => {
    createForm.mutate(
      { name, folderId: activeFolderId },
      {
        onSuccess: ({ data }) => {
          setFormPromptOpen(false)
          navigate(`/dashboard/forms/${data.id}`)
        },
      }
    )
  }

  const askDeleteFolder = (folder) =>
    setDeleteTarget({ kind: 'folder', id: folder.id, name: folder.name })

  const askDeleteForm = (form) =>
    setDeleteTarget({ kind: 'form', id: form.id, name: form.name })

  const confirmDelete = () => {
    if (!deleteTarget) return
    if (deleteTarget.kind === 'folder') {
      deleteFolder.mutate(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      })
    } else {
      deleteForm.mutate(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      })
    }
  }

  const loading = foldersLoading || formsLoading

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setFolderPromptOpen(true)}
          className="flex items-center gap-2 rounded-md border border-white/15 bg-[#252528] px-3 py-1.5 text-sm text-white/95 transition hover:border-white/25 hover:bg-[#2E2E32]"
        >
          <FolderPlus className="h-4 w-4 text-white/70" />
          Create a folder
        </button>

        {activeFolderId !== null && (
          <button
            type="button"
            onClick={() => setActiveFolder(null)}
            className="text-xs text-white/60 underline-offset-2 hover:text-white/90 hover:underline"
          >
            ← Back to all
          </button>
        )}

        {folders.map((folder) => (
          <FolderChip
            key={folder.id}
            folder={folder}
            active={folder.id === activeFolderId}
            onOpen={() => setActiveFolder(folder.id)}
            onDelete={() => askDeleteFolder(folder)}
          />
        ))}
      </div>

      {loading && folders.length === 0 && forms.length === 0 ? (
        <p className="pt-8 text-center text-sm text-white/50">Loading your workspace…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-5">
            <CreateTypebotCard onClick={() => setFormPromptOpen(true)} />
            {forms.map((form) => (
              <FormCard
                key={form.id}
                form={form}
                onOpen={(f) => navigate(`/dashboard/forms/${f.id}`)}
                onDelete={() => askDeleteForm(form)}
              />
            ))}
          </div>

          {forms.length === 0 && folders.length === 0 && (
            <p className="mt-4 text-center text-sm text-white/50">
              Start by creating a folder or a typebot form.
            </p>
          )}
        </>
      )}

      <PromptModal
        open={folderPromptOpen}
        onClose={() => setFolderPromptOpen(false)}
        onSubmit={handleCreateFolder}
        title="Create a folder"
        label="Folder name"
        placeholder="e.g., Computer Networks"
        submitLabel="Save"
        submitBusy={createFolder.isPending}
      />

      <PromptModal
        open={formPromptOpen}
        onClose={() => setFormPromptOpen(false)}
        onSubmit={handleCreateForm}
        title="Create a form"
        label="Form name"
        defaultValue="New form"
        placeholder="e.g., Customer feedback"
        submitLabel="Save"
        submitBusy={createForm.isPending}
      />

      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={
          deleteTarget?.kind === 'folder' ? 'Delete folder?' : 'Delete form?'
        }
        message={
          deleteTarget?.kind === 'folder'
            ? `"${deleteTarget?.name}" and all forms inside it will be deleted. This cannot be undone.`
            : `"${deleteTarget?.name}" will be permanently deleted. This cannot be undone.`
        }
        confirmLabel="Delete"
      />
    </div>
  )
}

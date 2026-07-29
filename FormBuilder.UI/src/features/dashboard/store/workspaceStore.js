import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Only local UI state — no server data (that lives in React Query cache).
 */
export const useWorkspaceStore = create(
  persist(
    (set) => ({
      activeFolderId: null,
      setActiveFolder: (id) => set({ activeFolderId: id }),
      resetWorkspace: () => set({ activeFolderId: null }),
    }),
    { name: 'formbuilder-workspace-ui' }
  )
)

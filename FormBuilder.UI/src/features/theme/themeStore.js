import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const THEME_IDS = ['light', 'dark', 'tail-blue']

export const useThemeStore = create(
  persist(
    (set) => ({
      themeId: 'dark',
      setTheme: (themeId) => {
        if (THEME_IDS.includes(themeId)) set({ themeId })
      },
    }),
    { name: 'formbuilder-theme' }
  )
)

import { useEffect } from 'react'
import { useThemeStore } from './themeStore.js'

export function ThemeApplier() {
  const themeId = useThemeStore((s) => s.themeId)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
  }, [themeId])

  return null
}

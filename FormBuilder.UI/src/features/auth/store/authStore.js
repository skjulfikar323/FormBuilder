import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setSession: (user, token) => {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('auth_user', JSON.stringify(user))
        set({ user, token, isAuthenticated: true })
      },

      clearSession: () => {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        set({ user: null, token: null, isAuthenticated: false })
      },

      hydrate: () => {
        const token = localStorage.getItem('auth_token')
        const userRaw = localStorage.getItem('auth_user')
        if (token && userRaw) {
          try {
            set({ user: JSON.parse(userRaw), token, isAuthenticated: true })
          } catch {
            get().clearSession()
          }
        }
      },
    }),
    {
      name: 'formbuilder-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api/authApi.js'
import { useAuthStore } from '../store/authStore.js'
import { useThemeStore } from '@features/theme/themeStore.js'
import { errorMessage } from '@config/api.js'

function syncThemeFromUser(user) {
  const t = user?.preferences?.themeId
  if (t) useThemeStore.getState().setTheme(t)
}

export function useLogin() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ data, message }) => {
      setSession(data.user, data.token)
      syncThemeFromUser(data.user)
      toast.success(message || `Welcome back, ${data.user.fullName}!`)
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Login failed. Check your credentials.'))
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const setSession = useAuthStore((s) => s.setSession)

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ data, message }) => {
      setSession(data.user, data.token)
      syncThemeFromUser(data.user)
      toast.success(message || 'Account created — welcome!')
      navigate('/dashboard', { replace: true })
    },
    onError: (error) => {
      toast.error(errorMessage(error, 'Registration failed. Try again.'))
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const clearSession = useAuthStore((s) => s.clearSession)

  return async () => {
    await authApi.logout()
    clearSession()
    toast.success('Signed out')
    navigate('/login', { replace: true })
  }
}

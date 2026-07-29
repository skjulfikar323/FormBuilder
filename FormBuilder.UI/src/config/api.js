import axios from 'axios'
import { env } from './env.js'

export const apiClient = axios.create({
  baseURL: env.API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const onPublicRoute = /^\/(login|register|f\/|$)/.test(window.location.pathname)
      if (!onPublicRoute) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

/**
 * Unwrap the backend's ApiResponse<T> envelope.
 * The backend always returns: { success, data, message, errors }
 * Throws on success:false, returns { data, message } on success:true.
 */
export function unwrap(response) {
  const body = response?.data
  if (!body || typeof body !== 'object' || !('success' in body)) {
    return { data: body, message: null }
  }
  if (!body.success) {
    const err = new Error(body.message || 'Request failed')
    err.errors = body.errors
    err.apiMessage = body.message
    throw err
  }
  return { data: body.data, message: body.message }
}

/**
 * Read an error message from any axios error, whether the server sent an
 * ApiResponse or a plain string, or the request failed entirely.
 */
export function errorMessage(error, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.message ||
    error?.apiMessage ||
    error?.message ||
    fallback
  )
}

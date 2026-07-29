import { apiClient, unwrap } from '@config/api.js'

export const authApi = {
  async login(credentials) {
    const res = await apiClient.post('/auth/login', credentials)
    return unwrap(res)
  },

  async register(payload) {
    const res = await apiClient.post('/auth/register', payload)
    return unwrap(res)
  },

  async me() {
    const res = await apiClient.get('/auth/me')
    return unwrap(res)
  },

  async logout() {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // even if server fails, we clear client session locally
    }
  },

  async changePassword(payload) {
    const res = await apiClient.post('/auth/change-password', payload)
    return unwrap(res)
  },

  async updateProfile(payload) {
    const res = await apiClient.put('/users/me', payload)
    return unwrap(res)
  },

  async updatePreferences(payload) {
    const res = await apiClient.put('/users/me/preferences', payload)
    return unwrap(res)
  },

  async clearWorkspace() {
    const res = await apiClient.delete('/users/me/workspace')
    return unwrap(res)
  },

  async deleteAccount() {
    const res = await apiClient.delete('/users/me')
    return unwrap(res)
  },
}

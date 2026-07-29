import { apiClient, unwrap } from '@config/api.js'

export const publicFormApi = {
  async getForm(id) {
    const res = await apiClient.get(`/public/forms/${id}`)
    return unwrap(res)
  },

  async incrementView(id) {
    try {
      await apiClient.post(`/public/forms/${id}/view`)
    } catch {
      // best-effort; don't block the UI
    }
  },

  async incrementStart(id) {
    try {
      await apiClient.post(`/public/forms/${id}/start`)
    } catch {
      // best-effort
    }
  },

  async submit(id, payload) {
    const res = await apiClient.post(`/public/forms/${id}/submissions`, payload)
    return unwrap(res)
  },
}

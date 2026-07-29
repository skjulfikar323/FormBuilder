import { apiClient, unwrap } from '@config/api.js'

export const foldersApi = {
  async list() {
    const res = await apiClient.get('/folders')
    return unwrap(res)
  },

  async create(payload) {
    const res = await apiClient.post('/folders', payload)
    return unwrap(res)
  },

  async rename(id, payload) {
    const res = await apiClient.put(`/folders/${id}`, payload)
    return unwrap(res)
  },

  async remove(id) {
    const res = await apiClient.delete(`/folders/${id}`)
    return unwrap(res)
  },
}

import { apiClient, unwrap } from '@config/api.js'

export const formsApi = {
  async list(folderId) {
    const params = folderId !== undefined && folderId !== null ? { folderId } : {}
    const res = await apiClient.get('/forms', { params })
    return unwrap(res)
  },

  async getById(id) {
    const res = await apiClient.get(`/forms/${id}`)
    return unwrap(res)
  },

  async create(payload) {
    const res = await apiClient.post('/forms', payload)
    return unwrap(res)
  },

  async update(id, payload) {
    const res = await apiClient.put(`/forms/${id}`, payload)
    return unwrap(res)
  },

  async remove(id) {
    const res = await apiClient.delete(`/forms/${id}`)
    return unwrap(res)
  },

  async getSubmissions(formId) {
    const res = await apiClient.get(`/forms/${formId}/submissions`)
    return unwrap(res)
  },

  async removeSubmission(formId, submissionId) {
    const res = await apiClient.delete(`/forms/${formId}/submissions/${submissionId}`)
    return unwrap(res)
  },
}

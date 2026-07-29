import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { formsApi } from '../api/formsApi.js'
import { errorMessage } from '@config/api.js'

export const FORMS_KEY = 'forms'

export function useForms(folderId) {
  return useQuery({
    queryKey: [FORMS_KEY, { folderId: folderId ?? null }],
    queryFn: async () => (await formsApi.list(folderId)).data,
    staleTime: 15_000,
  })
}

export function useForm(id) {
  return useQuery({
    queryKey: [FORMS_KEY, id],
    queryFn: async () => (await formsApi.getById(id)).data,
    enabled: !!id,
    staleTime: 15_000,
  })
}

export function useCreateForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: formsApi.create,
    onSuccess: ({ data, message }) => {
      qc.invalidateQueries({ queryKey: [FORMS_KEY] })
      toast.success(message || 'Form created')
      return data
    },
    onError: (err) => toast.error(errorMessage(err, 'Failed to create form')),
  })
}

export function useUpdateForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }) => formsApi.update(id, payload),
    onSuccess: ({ data }) => {
      qc.setQueryData([FORMS_KEY, data.id], data)
      qc.invalidateQueries({ queryKey: [FORMS_KEY], exact: false })
    },
    onError: (err) => toast.error(errorMessage(err, 'Failed to save form')),
  })
}

export function useDeleteForm() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: formsApi.remove,
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: [FORMS_KEY] })
      toast.success(message || 'Form deleted')
    },
    onError: (err) => toast.error(errorMessage(err, 'Failed to delete form')),
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { formsApi } from '@features/dashboard/api/formsApi.js'
import { errorMessage } from '@config/api.js'

export function useSubmissions(formId) {
  return useQuery({
    queryKey: ['submissions', formId],
    queryFn: async () => (await formsApi.getSubmissions(formId)).data,
    enabled: !!formId,
    staleTime: 10_000,
  })
}

export function useDeleteSubmission(formId) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (submissionId) => formsApi.removeSubmission(formId, submissionId),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: ['submissions', formId] })
      qc.invalidateQueries({ queryKey: ['forms', formId] })
      toast.success(message || 'Response deleted')
    },
    onError: (err) => toast.error(errorMessage(err, 'Failed to delete response')),
  })
}

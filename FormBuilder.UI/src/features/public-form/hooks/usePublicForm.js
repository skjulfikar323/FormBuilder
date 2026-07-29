import { useMutation, useQuery } from '@tanstack/react-query'
import { publicFormApi } from '../api/publicFormApi.js'
import { errorMessage } from '@config/api.js'
import toast from 'react-hot-toast'

export function usePublicForm(id) {
  return useQuery({
    queryKey: ['public-form', id],
    queryFn: async () => (await publicFormApi.getForm(id)).data,
    enabled: !!id,
    staleTime: 60_000,
    retry: false,
  })
}

export function useSubmitPublicForm(id) {
  return useMutation({
    mutationFn: (values) => publicFormApi.submit(id, { values }),
    onError: (err) => toast.error(errorMessage(err, 'Failed to submit form')),
  })
}

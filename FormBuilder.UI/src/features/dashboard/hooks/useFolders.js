import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { foldersApi } from '../api/foldersApi.js'
import { errorMessage } from '@config/api.js'

const FOLDERS_KEY = ['folders']

export function useFolders() {
  return useQuery({
    queryKey: FOLDERS_KEY,
    queryFn: async () => (await foldersApi.list()).data,
    staleTime: 30_000,
  })
}

export function useCreateFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: foldersApi.create,
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: FOLDERS_KEY })
      toast.success(message || 'Folder created')
    },
    onError: (err) => toast.error(errorMessage(err, 'Failed to create folder')),
  })
}

export function useRenameFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...payload }) => foldersApi.rename(id, payload),
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: FOLDERS_KEY })
      toast.success(message || 'Folder renamed')
    },
    onError: (err) => toast.error(errorMessage(err, 'Failed to rename folder')),
  })
}

export function useDeleteFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: foldersApi.remove,
    onSuccess: ({ message }) => {
      qc.invalidateQueries({ queryKey: FOLDERS_KEY })
      qc.invalidateQueries({ queryKey: ['forms'] })
      toast.success(message || 'Folder deleted')
    },
    onError: (err) => toast.error(errorMessage(err, 'Failed to delete folder')),
  })
}

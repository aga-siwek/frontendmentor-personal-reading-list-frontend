import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getMyShelves,
  getShelf,
  createShelf,
  updateShelf,
  deleteShelf,
  addBookToShelf,
  removeBookFromShelf,
} from '@/api/shelvesApi'

export const useMyShelves = () => {
  return useQuery({
    queryKey: ['shelves'],
    queryFn: getMyShelves,
  })
}

export const useShelf = (id: number) => {
  return useQuery({
    queryKey: ['shelves', id],
    queryFn: () => getShelf(id),
    enabled: !!id,
  })
}

export const useCreateShelf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createShelf(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] })
    },
  })
}

export const useUpdateShelf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; position?: number } }) =>
      updateShelf(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] })
    },
  })
}

export const useDeleteShelf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteShelf(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shelves'] })
    },
  })
}

export const useAddBookToShelf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ shelfId, isbn }: { shelfId: number; isbn: string }) =>
      addBookToShelf(shelfId, isbn),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shelves', variables.shelfId] })
      queryClient.invalidateQueries({ queryKey: ['shelves'] })
    },
  })
}

export const useRemoveBookFromShelf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ shelfId, isbn }: { shelfId: number; isbn: string }) =>
      removeBookFromShelf(shelfId, isbn),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['shelves', variables.shelfId] })
    },
  })
}

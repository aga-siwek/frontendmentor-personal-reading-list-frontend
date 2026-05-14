import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { BookStatus, ShelfParam, UserBook } from '@/types'
import {
  getMyBooks,
  getBook,
  searchBooks,
  addBook,
  addReadingProgress,
  updateUserBook,
} from '@/api/booksApi'

export const useMyBooks = (status?: BookStatus) => {
  return useQuery({
    queryKey: ['books', status ?? 'all'],
    queryFn: () => getMyBooks(status),
  })
}

export const useBook = (isbn: string) => {
  return useQuery({
    queryKey: ['books', isbn],
    queryFn: () => getBook(isbn),
    enabled: !!isbn,
  })
}

export const useSearchBooks = (query: string) => {
  return useQuery({
    queryKey: ['books', 'search', query],
    queryFn: () => searchBooks(query),
    enabled: query.length >= 2,
  })
}

export const useAddBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ isbn, status }: { isbn: string; status?: BookStatus }) =>
      addBook(isbn, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

export const useAddReadingProgress = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ isbn, currentPage }: { isbn: string; currentPage: number }) =>
      addReadingProgress(isbn, currentPage),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books', variables.isbn] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

export const useUpdateUserBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      isbn,
      data,
    }: {
      isbn: string
      data: Partial<Pick<UserBook, 'status' | 'current_page' | 'notes' | 'rating' | 'is_favourite'>>
    }) => updateUserBook(isbn, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['books', variables.isbn] })
      queryClient.invalidateQueries({ queryKey: ['books'] })
    },
  })
}

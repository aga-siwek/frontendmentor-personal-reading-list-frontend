import type { BookWithUserBook, BookStatus, UserBook, SearchResult, ShelfParam } from '@/types'
import axiosClient from '@/lib/axiosClient'

export const getMyBooks = async (shelf?: ShelfParam): Promise<BookWithUserBook[]> => {
  const books: BookWithUserBook[] = await axiosClient.get('/books/me/').then(r => r.data)
  if (!shelf || shelf === 'all') return books
  if (shelf === 'favorites') return books.filter(b => b.user_book.is_favourite)
  return books.filter(b => b.user_book.status === shelf)
}

export const getBook = async (isbn: string): Promise<BookWithUserBook> => {
  return axiosClient.get(`/books/${isbn}/`).then(r => r.data)
}

export const searchBooks = async (query: string): Promise<SearchResult[]> => {
  return axiosClient.get('/books/search/', { params: { q: query } }).then(r => r.data)
}

export const addBook = async (isbn: string, status: BookStatus = 'want_to_read'): Promise<UserBook> => {
  return axiosClient.post(`/books/${isbn}/`, { status }).then(r => r.data)
}

export const addReadingProgress = async (isbn: string, currentPage: number): Promise<{ isbn: string; current_page: number; date: string }> => {
  return axiosClient.post(`/books/${isbn}/progress/`, { current_page: currentPage }).then(r => r.data)
}

export const updateUserBook = async (
  isbn: string,
  data: Partial<Pick<UserBook, 'status' | 'current_page' | 'notes' | 'rating' | 'is_favourite'>>
): Promise<UserBook> => {
  return axiosClient.patch(`/books/${isbn}/`, data).then(r => r.data)
}

import type { BookWithUserBook, BookStatus, UserBook, SearchResult, ShelfParam } from '@/types'
import { mockBooks, mockSearchResults } from '@/data/mockData'

export const getMyBooks = async (shelf?: ShelfParam): Promise<BookWithUserBook[]> => {
  if (!shelf || shelf === 'all') return mockBooks
  if (shelf === 'favorites') return mockBooks.filter(b => b.user_book.is_favourite)
  return mockBooks.filter(b => b.user_book.status === shelf)
}

export const getBook = async (isbn: string): Promise<BookWithUserBook> => {
  const book = mockBooks.find(b => b.isbn === isbn)
  if (!book) throw new Error(`Book ${isbn} not found`)
  return book
}

export const searchBooks = async (query: string): Promise<SearchResult[]> => {
  return mockSearchResults.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.author.toLowerCase().includes(query.toLowerCase())
  )
}

export const addBook = async (
  isbn: string,
  status: BookStatus = 'want_to_read'
): Promise<UserBook> => {
  const book = mockBooks.find(b => b.isbn === isbn)
  if (!book) throw new Error(`Book ${isbn} not found`)
  return book.user_book
}

export const addReadingProgress = async (
  isbn: string,
  currentPage: number
): Promise<{ isbn: string; current_page: number; date: string }> => {
  return {
    isbn,
    current_page: currentPage,
    date: new Date().toISOString(),
  }
}

export const updateUserBook = async (
  isbn: string,
  data: Partial<Pick<UserBook, 'status' | 'current_page' | 'notes' | 'rating' | 'is_favourite'>>
): Promise<UserBook> => {
  const book = mockBooks.find(b => b.isbn === isbn)
  if (!book) throw new Error(`Book ${isbn} not found`)
  return { ...book.user_book, ...data }
}

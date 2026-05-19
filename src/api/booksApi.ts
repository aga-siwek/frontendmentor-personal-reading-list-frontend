import type { BookWithUserBook, BookStatus, UserBook, SearchResult, ShelfParam } from '@/types'
import { mockBooks, mockSearchResults } from '@/data/mockData'
// import axiosClient from '@/lib/axiosClient'

export const getMyBooks = async (shelf?: ShelfParam): Promise<BookWithUserBook[]> => {
  // TODO: return axiosClient.get('/books/', { params: { shelf } }).then(r => r.data)
  if (!shelf || shelf === 'all') return mockBooks
  if (shelf === 'favorites') return mockBooks.filter(b => b.user_book.is_favourite)
  return mockBooks.filter(b => b.user_book.status === shelf)
}

export const getBook = async (isbn: string): Promise<BookWithUserBook> => {
  // TODO: return axiosClient.get(`/books/${isbn}/`).then(r => r.data)
  const book = mockBooks.find(b => b.isbn === isbn)
  if (!book) throw new Error(`Book ${isbn} not found`)
  return book
}

export const searchBooks = async (query: string): Promise<SearchResult[]> => {
  // TODO: return axiosClient.get('/books/search/', { params: { q: query } }).then(r => r.data)
  return mockSearchResults.filter(b =>
    b.title.toLowerCase().includes(query.toLowerCase()) ||
    b.author.toLowerCase().includes(query.toLowerCase())
  )
}

export const addBook = async (
  isbn: string,
  status: BookStatus = 'want_to_read'
): Promise<UserBook> => {
  // TODO: return axiosClient.post('/books/', { isbn, status }).then(r => r.data)
  const book = mockBooks.find(b => b.isbn === isbn)
  if (!book) throw new Error(`Book ${isbn} not found`)
  return book.user_book
}

export const addReadingProgress = async (
  isbn: string,
  currentPage: number
): Promise<{ isbn: string; current_page: number; date: string }> => {
  // TODO: return axiosClient.post(`/books/${isbn}/progress/`, { current_page: currentPage }).then(r => r.data)
  const book = mockBooks.find(b => b.isbn === isbn)
  if (book) {
    book.user_book.current_page = currentPage
    if (book.number_of_pages) {
      book.user_book.percentage = parseFloat(
        Math.min((currentPage / book.number_of_pages) * 100, 100).toFixed(1)
      )
    }
  }
  return { isbn, current_page: currentPage, date: new Date().toISOString() }
}

export const updateUserBook = async (
  isbn: string,
  data: Partial<Pick<UserBook, 'status' | 'current_page' | 'notes' | 'rating' | 'is_favourite'>>
): Promise<UserBook> => {
  // TODO: return axiosClient.patch(`/books/${isbn}/`, data).then(r => r.data)
  const book = mockBooks.find(b => b.isbn === isbn)
  if (!book) throw new Error(`Book ${isbn} not found`)
  Object.assign(book.user_book, data)
  return book.user_book
}

export type BookStatus =
  | 'want_to_read'
  | 'currently_reading'
  | 'finished'
  | 'recommended'
  | 'rejected'

export type ShelfParam = BookStatus | 'all' | 'favorites'

export interface Category {
  id: number
  name: string
}

export interface BookCover {
  small: string | null
  medium: string | null
  large: string | null
}

export interface UserBook {
  user_id: number
  isbn: string
  status: BookStatus
  is_favourite: boolean
  current_page: number
  percentage: number | null
  notes: string | null
  rating: number | null
  last_updated: string | null
}

export interface BookWithUserBook {
  isbn: string
  title: string
  author: string
  cover: BookCover
  description: string | null
  number_of_pages: number | null
  publish_date: string | null
  publisher: string | null
  source_api_id: string | null
  categories: Category[]
  user_book: UserBook | null
}

export interface ReadingGoal {
  id: number
  user_id: number
  year: number
  goal: number
  books_finished: number
}

export interface User {
  user_id: number
  user_name: string | null
  user_email: string
  is_admin: boolean
}

export interface Shelf {
  id: number
  user_id: number
  name: string
  position: number
  is_default: boolean
  books: string[]
}

export interface SearchResult {
  isbn: string
  title: string
  author: string
  cover: BookCover
  first_publish_year: number | null
}

export interface LoginResponse {
  access_token: string
  message: string
  user_email: string
  user_name: string | null
}

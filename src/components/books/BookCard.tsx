import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import type { BookWithUserBook } from '@/types'
import BookProgress from './BookProgress'
import { useUpdateUserBook } from '@/queries/booksQueries'

interface BookCardProps {
  book: BookWithUserBook
}

const formatMonth = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const StarRating = ({ isbn, rating }: { isbn: string; rating: number | null }) => {
  const [hovered, setHovered] = useState<number | null>(null)
  const { mutate: updateBook } = useUpdateUserBook()

  const handleRate = (e: React.MouseEvent, value: number) => {
    e.stopPropagation()
    updateBook({ isbn, data: { rating: value } })
  }

  const active = hovered ?? rating ?? 0

  return (
    <div
      className="flex gap-0.5"
      onMouseLeave={() => setHovered(null)}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const value = i + 1
        return (
          <button
            key={i}
            onClick={e => handleRate(e, value)}
            onMouseEnter={() => setHovered(value)}
            className="transition-transform hover:scale-110"
            aria-label={`Rate ${value} stars`}
          >
            <Star
              size={14}
              className={
                value <= active
                  ? 'text-brand fill-brand'
                  : 'text-warm-border fill-warm-border'
              }
            />
          </button>
        )
      })}
    </div>
  )
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate()
  const { user_book } = book

  return (
    <article
      onClick={() => navigate(`/books/${book.isbn}`)}
      className="flex h-44 bg-white rounded-xl shadow-sm border border-warm-border overflow-hidden cursor-pointer hover:shadow-lg hover:border-brand/40 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="w-28 h-full shrink-0 bg-warm-border">
        {book.cover.medium ? (
          <img
            src={book.cover.medium}
            alt={book.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-warm-muted text-xs px-2 text-center">
            No cover
          </div>
        )}
      </div>

      <div className="flex flex-col justify-between p-4 flex-1 min-w-0">
        <div>
          <h3 className="font-semibold text-warm-text text-base leading-snug mb-0.5 line-clamp-2">
            {book.title}
          </h3>
          <p className="text-sm text-warm-muted mb-3">{book.author}</p>

          {book.categories.length > 0 && (
            <span className="inline-block text-xs text-warm-muted bg-warm-border/60 rounded-md px-2.5 py-1">
              {book.categories[0].name}
            </span>
          )}
        </div>

        <div className="mt-4">
          {user_book.status === 'currently_reading' && (
            <BookProgress percentage={user_book.percentage} />
          )}

          {user_book.status === 'finished' && (
            <div className="space-y-1">
              <StarRating isbn={book.isbn} rating={user_book.rating} />
              {user_book.last_updated && (
                <p className="text-xs text-warm-muted">
                  Finished {formatMonth(user_book.last_updated)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default BookCard

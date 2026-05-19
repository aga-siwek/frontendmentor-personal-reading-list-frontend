import { useNavigate } from 'react-router-dom'
import type { BookWithUserBook } from '@/types'
import BookProgress from './BookProgress'

interface BookCardProps {
  book: BookWithUserBook
}

const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate()
  const { user_book } = book

  return (
    <article
      onClick={() => navigate(`/books/${book.isbn}`)}
      className="flex bg-white rounded-xl shadow-sm border border-warm-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="w-28 shrink-0 bg-warm-border">
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

        <BookProgress
          percentage={user_book.percentage}
          className="mt-4"
        />
      </div>
    </article>
  )
}

export default BookCard

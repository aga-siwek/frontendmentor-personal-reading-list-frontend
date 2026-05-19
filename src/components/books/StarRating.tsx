import { Star } from 'lucide-react'
import { useUpdateUserBook } from '@/queries/booksQueries'

interface StarRatingProps {
  isbn: string
  rating: number | null
  size?: number
  readonly?: boolean
}

const StarRating = ({ isbn, rating, size = 14, readonly = false }: StarRatingProps) => {
  const { mutate: updateBook } = useUpdateUserBook()

  const handleRate = (e: React.MouseEvent, value: number) => {
    if (readonly) return
    e.stopPropagation()
    updateBook({ isbn, data: { rating: value } })
  }

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(value => (
        <button
          key={value}
          onClick={e => handleRate(e, value)}
          disabled={readonly}
          className={readonly ? 'cursor-default' : 'transition-transform hover:scale-110'}
          aria-label={readonly ? undefined : `Rate ${value} stars`}
        >
          <Star
            size={size}
            className={
              value <= (rating ?? 0)
                ? 'text-brand fill-brand'
                : 'text-warm-border fill-warm-border'
            }
          />
        </button>
      ))}
    </div>
  )
}

export default StarRating

import { useState, useRef, useEffect, useCallback } from 'react'
import type { BookWithUserBook } from '@/types'
import BookCard from './BookCard'

interface BookGridProps {
  books: BookWithUserBook[]
  title: string
}

const PAGE_SIZE = 9

const BookGrid = ({ books, title }: BookGridProps) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const visibleBooks = books.slice(0, visibleCount)
  const hasMore = visibleCount < books.length

  const loadMore = useCallback(() => {
    setVisibleCount(prev => Math.min(prev + PAGE_SIZE, books.length))
  }, [books.length])

  // Mobile: auto-load when sentinel enters viewport
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore()
      },
      { rootMargin: '120px' }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loadMore])

  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-warm-muted text-sm">No books here yet.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-2xl font-semibold text-warm-text">{title}</h2>
        <span className="text-sm text-warm-muted">{books.length} books</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visibleBooks.map(book => (
          <BookCard key={book.isbn} book={book} />
        ))}
      </div>

      {hasMore && (
        <>
          {/* Desktop: subtle load more text */}
          <div className="hidden md:flex justify-center mt-8">
            <button
              onClick={loadMore}
              className="text-sm text-warm-muted hover:text-brand transition-colors"
            >
              Load more ({books.length - visibleCount} more)
            </button>
          </div>

          {/* Mobile: sentinel for IntersectionObserver */}
          <div ref={sentinelRef} className="md:hidden h-10" aria-hidden="true" />
        </>
      )}
    </div>
  )
}

export default BookGrid

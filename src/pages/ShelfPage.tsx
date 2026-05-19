import { NavLink, useParams } from 'react-router-dom'
import { cn } from '@/lib/utils'
import type { ShelfParam } from '@/types'
import { useMyBooks } from '@/queries/booksQueries'
import BookGrid from '@/components/books/BookGrid'
import BookCardSkeleton from '@/components/books/BookCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

const SHELF_TITLES: Record<string, string> = {
  all: 'All Books',
  currently_reading: 'Currently Reading',
  want_to_read: 'Want to Read',
  finished: 'Read',
  favorites: 'Favorites',
}

const URL_TO_SHELF: Record<string, ShelfParam> = {
  all: 'all',
  'currently-reading': 'currently_reading',
  'want-to-read': 'want_to_read',
  read: 'finished',
  favorites: 'favorites',
}

const MOBILE_TABS = [
  { path: 'all', label: 'All' },
  { path: 'currently-reading', label: 'Reading' },
  { path: 'want-to-read', label: 'Want to Read' },
  { path: 'read', label: 'Read' },
  { path: 'favorites', label: 'Favorites' },
]

const normalizeStatus = (param: string): ShelfParam => {
  return URL_TO_SHELF[param] ?? 'all'
}

const ShelfPage = () => {
  const { status = 'all' } = useParams()
  const shelf = normalizeStatus(status)
  const title = SHELF_TITLES[shelf] ?? 'Books'

  const { data: books = [], isLoading } = useMyBooks(shelf)

  return (
    <>
      {/* Mobile tab strip */}
      <div className="md:hidden flex gap-2 overflow-x-auto px-4 py-3 bg-white border-b border-warm-border [&::-webkit-scrollbar]:hidden">
        {MOBILE_TABS.map(({ path, label }) => (
          <NavLink
            key={path}
            to={`/shelf/${path}`}
            className={({ isActive }) =>
              cn(
                'shrink-0 px-3 py-1.5 text-sm rounded-full transition-colors whitespace-nowrap',
                isActive
                  ? 'bg-brand text-white'
                  : 'bg-warm-border/60 text-warm-muted hover:text-warm-text'
              )
            }
          >
            {label}
          </NavLink>
        ))}
      </div>

      <div className="px-4 md:px-8 py-6">
        {isLoading ? (
          <>
            <div className="flex items-baseline gap-3 mb-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 9 }).map((_, i) => (
                <BookCardSkeleton key={i} />
              ))}
            </div>
          </>
        ) : (
          <BookGrid key={shelf} books={books} title={title} />
        )}
      </div>
    </>
  )
}

export default ShelfPage

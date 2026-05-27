import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, CheckCircle2, BookmarkPlus } from 'lucide-react'
import { useBook, useUpdateUserBook, useAddReadingProgress, useAddBook } from '@/queries/booksQueries'
import { useMyShelves, useAddBookToShelf, useRemoveBookFromShelf, useCreateShelf } from '@/queries/shelvesQueries'
import { Skeleton } from '@/components/ui/skeleton'
import BookProgress from '@/components/books/BookProgress'
import StarRating from '@/components/books/StarRating'

const STATUS_LABEL: Record<string, string> = {
  currently_reading: 'Currently Reading',
  want_to_read: 'Want to Read',
  finished: 'Read',
}

const LoadingSkeleton = () => (
  <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">
    <Skeleton className="h-7 w-32 mb-8 hidden md:block" />
    <div className="flex gap-8">
      <Skeleton className="hidden md:block w-44 h-64 rounded-xl shrink-0" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-9 w-4/5" />
        <Skeleton className="h-4 w-1/4" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-10 w-48 rounded-lg" />
      </div>
    </div>
  </div>
)

const SHELF_PAGE = 5

const ShelfSelector = ({ isbn }: { isbn: string }) => {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [visible, setVisible] = useState(SHELF_PAGE)
  const [newName, setNewName] = useState('')
  const [addingNew, setAddingNew] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const { data: shelves = [] } = useMyShelves()
  const { mutate: addBook } = useAddBookToShelf()
  const { mutate: removeBook } = useRemoveBookFromShelf()
  const { mutate: createShelf } = useCreateShelf()

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const filtered = search.trim()
    ? shelves.filter(s => s.name.toLowerCase().includes(search.toLowerCase()))
    : shelves

  const handleToggleShelf = (shelfId: number, isOn: boolean) => {
    if (isOn) removeBook({ shelfId, isbn })
    else addBook({ shelfId, isbn })
  }

  const handleCreate = () => {
    const name = newName.trim()
    if (!name) return
    createShelf(name, {
      onSuccess: (shelf) => {
        addBook({ shelfId: shelf.id, isbn })
        setNewName('')
        setAddingNew(false)
      },
    })
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-4 py-2 text-sm border border-warm-border rounded-lg text-warm-muted hover:border-brand hover:text-brand transition-colors"
      >
        <BookmarkPlus size={15} />
        Add to shelf
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setOpen(false)} />

          {/* Panel — bottom sheet on mobile, centered modal on desktop */}
          <div className="
            fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl flex flex-col max-h-[80vh]
            md:bottom-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:right-auto md:w-80 md:rounded-xl md:max-h-[70vh] md:shadow-xl md:border md:border-warm-border
          ">
            {/* Mobile handle + header */}
            <div className="md:hidden flex flex-col items-center pt-3 pb-2 border-b border-warm-border">
              <div className="w-10 h-1 bg-warm-border rounded-full mb-3" />
              <p className="text-sm font-semibold text-warm-text">Add to shelf</p>
            </div>

            {/* Search */}
            <div className="px-3 py-2 border-b border-warm-border">
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setVisible(SHELF_PAGE) }}
                placeholder="Search shelves..."
                autoFocus
                className="w-full text-sm text-warm-text placeholder:text-warm-muted bg-transparent outline-none"
              />
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1">
              {filtered.length === 0 && (
                <p className="px-4 py-3 text-sm text-warm-muted">No shelves found.</p>
              )}
              {filtered.slice(0, visible).map(shelf => {
                const isOn = shelf.books.includes(isbn)
                return (
                  <button
                    key={shelf.id}
                    onClick={() => handleToggleShelf(shelf.id, isOn)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-warm-text hover:bg-brand-light transition-colors"
                  >
                    <span className={`w-6 h-6 md:w-5 md:h-5 rounded border-2 flex items-center justify-center shrink-0 ${isOn ? 'bg-brand border-brand' : 'border-warm-border'}`}>
                      {isOn && <CheckCircle2 size={14} className="text-white" />}
                    </span>
                    <span className="truncate">{shelf.name}</span>
                  </button>
                )
              })}
              {filtered.length > visible && (
                <button
                  onClick={() => setVisible(v => v + SHELF_PAGE)}
                  className="w-full px-4 py-2.5 text-xs text-warm-muted hover:text-brand transition-colors text-left border-t border-warm-border/50"
                >
                  Load more ({filtered.length - visible} more)
                </button>
              )}
            </div>

            {/* New shelf */}
            <div className="border-t border-warm-border">
              {addingNew ? (
                <div className="px-3 py-3 space-y-2">
                  <input
                    type="text"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleCreate(); if (e.key === 'Escape') setAddingNew(false) }}
                    autoFocus
                    placeholder="Shelf name"
                    className="w-full text-sm border border-warm-border rounded-md px-2.5 py-1.5 text-warm-text bg-transparent outline-none focus:border-brand transition-colors"
                  />
                  <div className="flex gap-3">
                    <button onClick={() => setAddingNew(false)} className="text-xs text-warm-muted hover:text-warm-text transition-colors">Cancel</button>
                    <button onClick={handleCreate} className="text-xs text-brand font-medium hover:text-brand-dark transition-colors">Create & add</button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setAddingNew(true)}
                  className="w-full px-4 py-3 text-sm text-brand hover:bg-brand-light transition-colors text-left"
                >
                  + New shelf
                </button>
              )}
            </div>

            {/* Mobile safe area */}
            <div className="md:hidden h-6" />
          </div>
        </>
      )}
    </div>
  )
}

interface PageInputProps {
  isbn: string
  currentPage: number
  totalPages?: number
  onSave: (page: number) => void
}

const PageInput = ({ isbn: _isbn, currentPage, totalPages, onSave }: PageInputProps) => {
  const [value, setValue] = useState(String(currentPage ?? 0))

  const handleSave = () => {
    const page = parseInt(value)
    if (!isNaN(page) && page >= 0) onSave(page)
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSave()}
        min={0}
        max={totalPages}
        className="w-20 text-sm border border-warm-border rounded-lg px-2.5 py-1.5 text-warm-text bg-transparent outline-none focus:border-brand transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {totalPages && (
        <span className="text-sm text-warm-muted">/ {totalPages}</span>
      )}
      <button
        onClick={handleSave}
        className="flex-1 md:flex-none px-4 py-1.5 bg-brand text-white text-sm rounded-lg hover:bg-brand-dark transition-colors"
      >
        Save
      </button>
    </div>
  )
}

const BookDetailPage = () => {
  const { isbn } = useParams<{ isbn: string }>()
  const navigate = useNavigate()
  const { data: book, isLoading } = useBook(isbn!)
  const { mutate: updateBook } = useUpdateUserBook()
  const { mutate: addProgress } = useAddReadingProgress()
  const { mutate: addBook, isPending: isAdding } = useAddBook()

  const [showNotes, setShowNotes] = useState(false)
  const [noteText, setNoteText] = useState('')

  if (isLoading) return <LoadingSkeleton />
  if (!book) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-warm-muted text-sm">Book not found.</p>
      </div>
    )
  }

  const { user_book } = book
  const cover = book.cover.medium || book.cover.small

  const handleToggleNotes = () => {
    if (!showNotes) setNoteText(user_book?.notes ?? '')
    setShowNotes(v => !v)
  }

  const handleSaveNotes = () => {
    updateBook({ isbn: book.isbn, data: { notes: noteText } })
    setShowNotes(false)
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-4xl mx-auto">

      {/* Back / header */}
      <button
        onClick={() => navigate(-1)}
        className="md:hidden flex items-center gap-1.5 text-sm text-warm-muted hover:text-warm-text transition-colors mb-5"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <h1 className="hidden md:block text-2xl font-semibold text-warm-text mb-8">
        Book Details
      </h1>

      {/* ── HERO ROW ── */}
      <div className="flex flex-col min-[570px]:flex-row gap-5 md:gap-8 mb-8">

        {/* Cover */}
        <div className="flex justify-center min-[570px]:block min-[570px]:w-28 min-[570px]:shrink-0 min-[570px]:self-start md:w-44">
          <div className="w-36 min-[570px]:w-full">
            {cover ? (
              <img
                src={cover}
                alt={book.title}
                className="w-full rounded-xl shadow-md object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-xl bg-warm-border flex items-center justify-center text-warm-muted text-xs text-center px-2">
                No cover
              </div>
            )}
          </div>
        </div>

        {/* Title + meta + actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-1">
            <h2 className="text-xl min-[570px]:text-2xl md:text-3xl font-bold text-warm-text leading-snug">
              {book.title}
            </h2>
            {user_book && (
              <div className="relative group shrink-0 mt-1">
                <button
                  onClick={() => updateBook({ isbn: book.isbn, data: { is_favourite: !user_book.is_favourite } })}
                  aria-label={user_book.is_favourite ? 'Remove from favourites' : 'Add to favourites'}
                  className="p-2 -m-2 md:p-0 md:m-0"
                >
                  <Heart
                    size={26}
                    className={`transition-colors ${
                      user_book.is_favourite
                        ? 'fill-brand text-brand'
                        : 'text-warm-border hover:text-brand'
                    }`}
                  />
                </button>
                <span className="pointer-events-none absolute right-0 top-7 text-xs bg-warm-text text-white rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                  {user_book.is_favourite ? 'In favourites' : 'Add to favourites'}
                </span>
              </div>
            )}
          </div>
          <p className="text-warm-muted mb-4">By {book.author}</p>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            {user_book && (
              <span className="text-xs font-medium text-brand bg-brand-light rounded-full px-3 py-1">
                {STATUS_LABEL[user_book.status] ?? user_book.status}
              </span>
            )}
            {book.categories.map(cat => (
              <span key={cat.id} className="text-xs text-warm-muted bg-warm-border/60 rounded-full px-3 py-1">
                {cat.name}
              </span>
            ))}
          </div>

          {/* Progress — currently reading */}
          {user_book?.status === 'currently_reading' && (
            <div className="mb-5 space-y-2">
              <BookProgress percentage={user_book.percentage} />
              <div className="flex items-center justify-between">
                <p className="text-xs text-warm-muted">
                  {user_book.percentage ?? 0}% · page {user_book.current_page}
                  {book.number_of_pages ? ` of ${book.number_of_pages}` : ''}
                </p>
                <button
                  onClick={() => updateBook({ isbn: book.isbn, data: { status: 'finished' } })}
                  className="flex items-center gap-1 text-xs text-warm-muted hover:text-brand transition-colors"
                >
                  <CheckCircle2 size={13} />
                  Mark as finished
                </button>
              </div>
              <PageInput
                isbn={book.isbn}
                currentPage={user_book.current_page ?? 0}
                totalPages={book.number_of_pages ?? undefined}
                onSave={page => addProgress({ isbn: book.isbn, currentPage: page })}
              />
            </div>
          )}

          {/* Rating — finished */}
          {user_book?.status === 'finished' && (
            <div className="mb-5 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-warm-muted">Your rating</p>
                {user_book.last_updated && (
                  <p className="text-xs text-warm-muted">
                    Finished {new Date(user_book.last_updated).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
              <StarRating isbn={book.isbn} rating={user_book.rating} size={20} />
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {!user_book && (
              <button
                onClick={() => addBook({ isbn: book.isbn, status: 'want_to_read' })}
                disabled={isAdding}
                className="w-full min-[570px]:w-auto px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-60"
              >
                {isAdding ? 'Adding...' : 'Add to Library'}
              </button>
            )}
            {user_book?.status === 'want_to_read' && (
              <button
                onClick={() => updateBook({ isbn: book.isbn, data: { status: 'currently_reading', current_page: 0 } })}
                className="w-full min-[570px]:w-auto px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors"
              >
                Start Reading
              </button>
            )}
            {user_book?.status === 'finished' && (
              <button
                onClick={() => updateBook({ isbn: book.isbn, data: { status: 'currently_reading', current_page: 0 } })}
                className="w-full min-[570px]:w-auto px-5 py-2.5 bg-brand text-white text-sm font-medium rounded-xl hover:bg-brand-dark transition-colors"
              >
                Read Again
              </button>
            )}
            {user_book && <ShelfSelector isbn={book.isbn} />}
          </div>
        </div>
      </div>

      {/* ── DESCRIPTION ── */}
      {book.description && (
        <p className="text-sm text-warm-text/80 leading-relaxed mb-8">
          {book.description}
        </p>
      )}

      {/* ── NOTES ── */}
      {user_book && <div className="mb-8">
        {showNotes ? (
          <div className="space-y-2">
            <textarea
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSaveNotes() } }}
              placeholder="Write your review or notes about this book..."
              rows={4}
              autoFocus
              className="w-full text-sm border border-warm-border rounded-lg px-3 py-2.5 text-warm-text placeholder:text-warm-muted outline-none focus:border-brand transition-colors resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowNotes(false)} className="text-sm text-warm-muted hover:text-warm-text px-3 py-1.5 transition-colors">
                Cancel
              </button>
              <button onClick={handleSaveNotes} className="px-4 py-1.5 bg-brand text-white text-sm rounded-lg hover:bg-brand-dark transition-colors">
                Save
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleToggleNotes}
            className="group cursor-pointer p-4 rounded-lg border border-warm-border/40 hover:border-brand/40 hover:bg-warm-border/10 transition-colors"
          >
            <p className="text-xs font-semibold text-warm-muted uppercase tracking-wide mb-2">Your Review</p>
            {user_book.notes ? (
              <p className="text-sm text-warm-text leading-relaxed">{user_book.notes}</p>
            ) : (
              <p className="text-sm text-warm-muted italic">Add a review or notes about this book...</p>
            )}
          </div>
        )}
      </div>}

      {/* ── METADATA ── */}
      <div className="border-t border-warm-border pt-5 flex flex-wrap gap-x-8 gap-y-3">
        {book.publish_date && (
          <div>
            <p className="text-xs text-warm-muted">Published</p>
            <p className="text-sm font-medium text-warm-text">{book.publish_date}</p>
          </div>
        )}
        {book.number_of_pages && (
          <div>
            <p className="text-xs text-warm-muted">Pages</p>
            <p className="text-sm font-medium text-warm-text">{book.number_of_pages}</p>
          </div>
        )}
        {book.publisher && (
          <div>
            <p className="text-xs text-warm-muted">Publisher</p>
            <p className="text-sm font-medium text-warm-text">{book.publisher}</p>
          </div>
        )}
      </div>

    </div>
  )
}

export default BookDetailPage

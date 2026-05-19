import { useState } from 'react'
import { BookOpen, Bookmark, Check, Star, Library, Plus } from 'lucide-react'
import NavItem from './NavItem'
import ReadingGoal from './ReadingGoal'
import { useMyBooks } from '@/queries/booksQueries'
import { useMyShelves, useCreateShelf } from '@/queries/shelvesQueries'

const SHELVES_LIMIT = 5

const Sidebar = () => {
  const { data: allBooks = [] } = useMyBooks()
  const { data: shelves = [] } = useMyShelves()
  const [showAll, setShowAll] = useState(false)
  const [shelfSearch, setShelfSearch] = useState('')
  const [addingShelf, setAddingShelf] = useState(false)
  const [newShelfName, setNewShelfName] = useState('')
  const { mutate: createShelf } = useCreateShelf()

  const handleCreateShelf = () => {
    const name = newShelfName.trim()
    if (!name) return
    createShelf(name, {
      onSuccess: () => { setNewShelfName(''); setAddingShelf(false) },
    })
  }

  const filteredShelves = shelfSearch.trim()
    ? shelves.filter(s => s.name.toLowerCase().includes(shelfSearch.toLowerCase()))
    : shelves

  const counts = {
    all: allBooks.length,
    currently_reading: allBooks.filter(b => b.user_book.status === 'currently_reading').length,
    want_to_read: allBooks.filter(b => b.user_book.status === 'want_to_read').length,
    read: allBooks.filter(b => b.user_book.status === 'finished').length,
    favorites: allBooks.filter(b => b.user_book.is_favourite).length,
  }

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-warm-border">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-warm-border">
        <div className="w-8 h-8 bg-brand rounded-lg flex items-center justify-center shrink-0">
          <BookOpen size={16} className="text-white" />
        </div>
        <span className="font-semibold text-warm-text text-lg">Bookshelf</span>
      </div>

      <div className="px-4 py-3 border-b border-warm-border">
        <div className="flex items-center gap-2 bg-white border border-warm-border rounded-lg px-3 py-2">
          <Library size={14} className="text-warm-muted shrink-0" />
          <input
            type="text"
            value={shelfSearch}
            onChange={e => { setShelfSearch(e.target.value); setShowAll(true) }}
            placeholder="Search shelves..."
            className="text-sm text-warm-text placeholder:text-warm-muted bg-transparent outline-none w-full"
          />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <p className="px-5 mb-2 text-xs font-semibold uppercase tracking-widest text-warm-muted">
          Library
        </p>
        <div className="space-y-0.5 pr-2">
          <NavItem to="/shelf/all" icon={BookOpen} label="All Books" count={counts.all} />
          <NavItem to="/shelf/currently-reading" icon={BookOpen} label="Currently Reading" count={counts.currently_reading} />
          <NavItem to="/shelf/want-to-read" icon={Bookmark} label="Want to Read" count={counts.want_to_read} />
          <NavItem to="/shelf/read" icon={Check} label="Read" count={counts.read} />
          <NavItem to="/shelf/favorites" icon={Star} label="Favorites" count={counts.favorites} />
        </div>

        {shelves.length > 0 && (
          <div className="mt-5">
            <p className="px-5 mb-2 text-xs font-semibold uppercase tracking-widest text-warm-muted">
              My Shelves
            </p>
            <div className="space-y-0.5 pr-2">
              {(showAll ? filteredShelves : filteredShelves.slice(0, SHELVES_LIMIT)).map(shelf => (
                <NavItem
                  key={shelf.id}
                  to={`/shelves/${shelf.id}`}
                  icon={BookOpen}
                  label={shelf.name}
                  count={shelf.books.length}
                />
              ))}
            </div>
            {!shelfSearch && filteredShelves.length > SHELVES_LIMIT && (
              <button
                onClick={() => setShowAll(v => !v)}
                className="mt-1 px-5 text-xs text-warm-muted hover:text-brand transition-colors"
              >
                {showAll ? 'Show less' : `${shelves.length - SHELVES_LIMIT} more...`}
              </button>
            )}
          </div>
        )}

        <div className="mt-3 px-4">
          {addingShelf ? (
            <div className="space-y-1.5">
              <input
                type="text"
                value={newShelfName}
                onChange={e => setNewShelfName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreateShelf(); if (e.key === 'Escape') setAddingShelf(false) }}
                autoFocus
                placeholder="Shelf name"
                className="w-full text-sm border border-warm-border rounded-lg px-2.5 py-1.5 text-warm-text bg-transparent outline-none focus:border-brand transition-colors"
              />
              <div className="flex gap-3">
                <button onClick={() => setAddingShelf(false)} className="text-xs text-warm-muted hover:text-warm-text transition-colors">Cancel</button>
                <button onClick={handleCreateShelf} className="text-xs text-brand font-medium hover:text-brand-dark transition-colors">Save</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingShelf(true)}
              className="flex items-center gap-2 text-xs text-warm-muted hover:text-brand transition-colors py-1"
            >
              <Plus size={14} />
              Add shelf
            </button>
          )}
        </div>
      </nav>

      <ReadingGoal />
    </div>
  )
}

export default Sidebar

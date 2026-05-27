import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Settings, LogOut, BookOpen, X, Clock } from 'lucide-react'
import { useSearchBooks } from '@/queries/booksQueries'
import { useCurrentUser } from '@/queries/authQueries'
import { useDebounce } from '@/lib/useDebounce'
import type { SearchResult } from '@/types'

// Session-level cache: stores query + results so we never re-fetch for history items
type HistoryEntry = { query: string; results: SearchResult[] }
const sessionHistory: HistoryEntry[] = []

const saveToHistory = (query: string, results: SearchResult[]) => {
  if (query.length < 2 || results.length === 0) return
  const idx = sessionHistory.findIndex(h => h.query.toLowerCase() === query.toLowerCase())
  if (idx !== -1) sessionHistory.splice(idx, 1)
  sessionHistory.unshift({ query, results })
  if (sessionHistory.length > 10) sessionHistory.pop()
}

const getInitials = (name: string | null, email: string): string => {
  if (name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }
  return email[0].toUpperCase()
}

// ─── Recent searches list (shown when input is empty) ───────────────────────

const RecentSearches = ({
  onSelect,
}: {
  onSelect: (entry: HistoryEntry) => void
}) => (
  <div className="absolute top-full mt-1 w-full bg-white border border-warm-border rounded-lg shadow-lg z-50 overflow-hidden">
    <p className="px-3 pt-2.5 pb-1 text-xs font-medium text-warm-muted/70 uppercase tracking-wide">Recently searched</p>
    {sessionHistory.map(entry => (
      <button
        key={entry.query}
        onClick={() => onSelect(entry)}
        className="flex items-center gap-2 w-full px-3 py-2.5 hover:bg-brand-light transition-colors text-left"
      >
        <Clock size={13} className="text-warm-muted shrink-0" />
        <span className="text-sm text-warm-text truncate">{entry.query}</span>
      </button>
    ))}
  </div>
)

// ─── Search results list ─────────────────────────────────────────────────────

const SearchResults = ({
  results,
  isLoading,
  onSelect,
}: {
  results: SearchResult[]
  isLoading: boolean
  onSelect: (isbn: string) => void
}) => (
  <div className="absolute top-full mt-1 w-full bg-white border border-warm-border rounded-lg shadow-lg z-50 overflow-hidden">
    {isLoading ? (
      <div className="px-4 py-3">
        <p className="text-sm text-warm-muted">Searching...</p>
        <p className="text-xs text-warm-muted/70 mt-0.5">Open Library is a free API — results may take up to 25 seconds</p>
      </div>
    ) : results.length === 0 ? (
      <p className="px-4 py-3 text-sm text-warm-muted">No results found</p>
    ) : (
      <ul>
        {results.map(book => (
          <li key={book.isbn}>
            <button
              onClick={() => onSelect(book.isbn)}
              className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-brand-light transition-colors text-left"
            >
              {(book.cover.medium || book.cover.small) ? (
                <img
                  src={(book.cover.medium || book.cover.small)!}
                  alt={book.title}
                  className="w-8 h-11 object-cover rounded shrink-0"
                />
              ) : (
                <div className="w-8 h-11 bg-warm-border rounded shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-medium text-warm-text truncate">{book.title}</p>
                <p className="text-xs text-warm-muted truncate">{book.author}</p>
                {book.first_publish_year && (
                  <p className="text-xs text-warm-muted">{book.first_publish_year}</p>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
)

// ─── Header ──────────────────────────────────────────────────────────────────

const Header = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  // When true we're showing cached results for a history item — skip API call
  const [historyMode, setHistoryMode] = useState(false)
  const [cachedResults, setCachedResults] = useState<SearchResult[]>([])
  const desktopSearchRef = useRef<HTMLDivElement>(null)
  const mobileSearchRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 500)
  // Pass '' when in historyMode so the query hook stays disabled
  const { data: apiResults = [], isFetching } = useSearchBooks(historyMode ? '' : debouncedQuery)
  const { data: user } = useCurrentUser()

  // Save API results to session cache when they arrive
  useEffect(() => {
    if (!historyMode && debouncedQuery.length >= 2 && apiResults.length > 0) {
      saveToHistory(debouncedQuery, apiResults)
    }
  }, [debouncedQuery, apiResults, historyMode])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const inDesktop = desktopSearchRef.current?.contains(e.target as Node)
      const inMobile = mobileSearchRef.current?.contains(e.target as Node)
      if (!inDesktop && !inMobile) setOpen(false)
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleQueryChange = (value: string) => {
    setQuery(value)
    setHistoryMode(false)
    setOpen(true)
  }

  // Click on a recent search: show cached results, skip API
  const handleHistorySelect = (entry: HistoryEntry) => {
    setQuery(entry.query)
    setCachedResults(entry.results)
    setHistoryMode(true)
    setOpen(true)
  }

  const handleSelect = (isbn: string) => {
    setQuery('')
    setHistoryMode(false)
    setOpen(false)
    setMobileSearchOpen(false)
    navigate(`/books/${isbn}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const initials = user ? getInitials(user.user_name, user.user_email) : '?'

  const displayResults = historyMode ? cachedResults : apiResults
  const isLoading = !historyMode && isFetching

  // Which dropdown to show
  const showRecentSearches = open && query.length === 0 && sessionHistory.length > 0
  const showResults = open && query.length >= 2

  const searchDropdown = showRecentSearches ? (
    <RecentSearches onSelect={handleHistorySelect} />
  ) : showResults ? (
    <SearchResults results={displayResults} isLoading={isLoading} onSelect={handleSelect} />
  ) : null

  const searchInput = (onChange: (v: string) => void, extraProps?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      type="text"
      value={query}
      onChange={e => onChange(e.target.value)}
      onFocus={() => setOpen(true)}
      placeholder="Search books..."
      className="text-sm text-warm-text placeholder:text-warm-muted bg-transparent outline-none w-full"
      {...extraProps}
    />
  )

  return (
    <header>
      {/* ===== MOBILE ===== */}
      <div className="md:hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-warm-border bg-main">
          <button onClick={() => navigate('/shelf/all')} className="flex items-center gap-2">
            <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center shrink-0">
              <BookOpen size={14} className="text-white" />
            </div>
            <span className="font-semibold text-warm-text">Bookshelf</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setMobileSearchOpen(v => !v)
                setQuery('')
                setHistoryMode(false)
                setOpen(false)
              }}
              className="text-warm-muted hover:text-warm-text transition-colors"
              aria-label="Search"
            >
              {mobileSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>

            <div ref={menuRef} className="relative">
              <button
                onClick={() => setMenuOpen(v => !v)}
                className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-semibold hover:bg-brand-dark transition-colors shrink-0"
              >
                {initials}
              </button>
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-warm-border rounded-lg shadow-lg z-50 overflow-hidden">
                  <button
                    onClick={() => { navigate('/settings'); setMenuOpen(false) }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-warm-text hover:bg-brand-light transition-colors"
                  >
                    <Settings size={15} className="text-warm-muted" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-warm-text hover:bg-brand-light transition-colors"
                  >
                    <LogOut size={15} className="text-warm-muted" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {mobileSearchOpen && (
          <div ref={mobileSearchRef} className="relative px-4 py-3 bg-main border-b border-warm-border">
            <div className="flex items-center gap-2 bg-white border border-warm-border rounded-lg px-3 py-2">
              <Search size={15} className="text-warm-muted shrink-0" />
              {searchInput(handleQueryChange, { autoFocus: true })}
            </div>
            {searchDropdown}
          </div>
        )}
      </div>

      {/* ===== DESKTOP ===== */}
      <div className="hidden md:flex items-center justify-end gap-4 px-8 py-3 border-b border-warm-border bg-main">
        <div ref={desktopSearchRef} className="relative w-80">
          <div className="flex items-center gap-2 bg-white border border-warm-border rounded-lg px-3 py-2">
            <Search size={15} className="text-warm-muted shrink-0" />
            {searchInput(handleQueryChange)}
          </div>
          {searchDropdown}
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-semibold shrink-0 hover:bg-brand-dark transition-colors"
          >
            {initials}
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-warm-border rounded-lg shadow-lg z-50 overflow-hidden">
              <button
                onClick={() => { navigate('/settings'); setMenuOpen(false) }}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-warm-text hover:bg-brand-light transition-colors"
              >
                <Settings size={15} className="text-warm-muted" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-warm-text hover:bg-brand-light transition-colors"
              >
                <LogOut size={15} className="text-warm-muted" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header

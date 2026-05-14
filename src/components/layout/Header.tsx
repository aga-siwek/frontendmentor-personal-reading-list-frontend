import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Settings, LogOut } from 'lucide-react'
import { useSearchBooks } from '@/queries/booksQueries'
import { useCurrentUser } from '@/queries/authQueries'
import { useDebounce } from '@/lib/useDebounce'

const getInitials = (name: string | null, email: string): string => {
  if (name) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }
  return email[0].toUpperCase()
}

const Header = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const debouncedQuery = useDebounce(query, 500)
  const { data: results = [] } = useSearchBooks(debouncedQuery)
  const { data: user } = useCurrentUser()

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handleSelect = (isbn: string) => {
    setQuery('')
    setOpen(false)
    navigate(`/books/${isbn}`)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-end gap-4 px-8 py-3 border-b border-warm-border bg-main">
      <div ref={searchRef} className="relative w-80">
        <div className="flex items-center gap-2 bg-white border border-warm-border rounded-lg px-3 py-2">
          <Search size={15} className="text-warm-muted shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            placeholder="Search books..."
            className="text-sm text-warm-text placeholder:text-warm-muted bg-transparent outline-none w-full"
          />
        </div>

        {open && debouncedQuery.length >= 2 && (
          <div className="absolute top-full mt-1 w-full bg-white border border-warm-border rounded-lg shadow-lg z-50 overflow-hidden">
            {results.length === 0 ? (
              <p className="px-4 py-3 text-sm text-warm-muted">No results found</p>
            ) : (
              <ul>
                {results.map(book => (
                  <li key={book.isbn}>
                    <button
                      onClick={() => handleSelect(book.isbn)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-brand-light transition-colors text-left"
                    >
                      {book.cover.small ? (
                        <img
                          src={book.cover.small}
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
        )}
      </div>

      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-semibold shrink-0 hover:bg-brand-dark transition-colors"
        >
          {user ? getInitials(user.user_name, user.user_email) : '?'}
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
    </header>
  )
}

export default Header

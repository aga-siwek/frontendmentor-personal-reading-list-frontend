import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation, Link } from 'react-router-dom'
import { BookOpen, BookMarked, Target, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGoal } from '@/queries/goalQueries'

const GoalPanel = ({ onClose }: { onClose: () => void }) => {
  const year = new Date().getFullYear()
  const { data: goal, isLoading, isError } = useGoal(year)

  return (
    <div className="px-5 py-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-warm-muted mb-3">
        Reading Goal {year}
      </p>

      {isLoading && (
        <p className="text-sm text-warm-muted">Loading...</p>
      )}

      {(isError || (!isLoading && !goal)) && (
        <div>
          <p className="text-sm text-warm-muted mb-2">No goal set for this year.</p>
          <Link
            to="/settings"
            onClick={onClose}
            className="text-sm text-brand hover:underline"
          >
            Add goal for {year}
          </Link>
        </div>
      )}

      {goal && (() => {
        const percentage = Math.round((goal.books_finished / goal.goal) * 100)
        const booksLeft = goal.goal - goal.books_finished
        return (
          <>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-2xl font-bold text-warm-text">
                {goal.books_finished}
                <span className="text-base font-normal text-warm-muted"> / {goal.goal} books</span>
              </span>
              <span className="text-sm font-medium text-brand">{percentage}%</span>
            </div>
            <div className="h-2 bg-warm-border rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-brand rounded-full transition-all"
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <p className="text-xs text-warm-muted">
              {booksLeft > 0 ? `${booksLeft} books to go` : 'Goal reached!'}
            </p>
          </>
        )
      })()}
    </div>
  )
}

const BottomNav = () => {
  const location = useLocation()
  const [goalOpen, setGoalOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const isLibrary = location.pathname.startsWith('/shelf') || location.pathname.startsWith('/shelves')

  useEffect(() => {
    setGoalOpen(false)
  }, [location.pathname])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setGoalOpen(false)
      }
    }
    if (goalOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [goalOpen])

  return (
    <div className="md:hidden" ref={panelRef}>
      {/* Goal panel */}
      {goalOpen && (
        <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-warm-border shadow-lg z-40">
          <GoalPanel onClose={() => setGoalOpen(false)} />
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-warm-border z-40 flex">
        <NavLink
          to="/shelf/all"
          onClick={() => setGoalOpen(false)}
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors',
            isLibrary && !goalOpen ? 'text-brand' : 'text-warm-muted'
          )}
        >
          <BookOpen size={20} />
          <span>Library</span>
        </NavLink>

        <NavLink
          to="/shelf/currently-reading"
          onClick={() => setGoalOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors',
              isActive && !goalOpen ? 'text-brand' : 'text-warm-muted'
            )
          }
        >
          <BookMarked size={20} />
          <span>Reading</span>
        </NavLink>

        <button
          onClick={() => setGoalOpen(v => !v)}
          className={cn(
            'flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors',
            goalOpen ? 'text-brand' : 'text-warm-muted'
          )}
        >
          <Target size={20} />
          <span>Goal</span>
        </button>

        <NavLink
          to="/settings"
          onClick={() => setGoalOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex-1 flex flex-col items-center justify-center gap-1 text-xs transition-colors',
              isActive ? 'text-brand' : 'text-warm-muted'
            )
          }
        >
          <User size={20} />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  )
}

export default BottomNav

import { useState, useRef, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BookOpen, BookMarked, Target, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGoal, useSetGoal } from '@/queries/goalQueries'

const GoalPanel = ({ onClose: _onClose }: { onClose: () => void }) => {
  const year = new Date().getFullYear()
  const { data: goal, isLoading, isError } = useGoal(year)
  const { mutate: saveGoal } = useSetGoal()

  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState('')

  const handleSave = () => {
    const value = parseInt(input)
    if (!isNaN(value) && value > 0) {
      saveGoal({ year, goal: value })
      setEditing(false)
    }
  }

  const handleStart = () => {
    setInput(String(goal?.goal ?? ''))
    setEditing(true)
  }

  if (isLoading) return <div className="px-5 py-4"><p className="text-sm text-warm-muted">Loading...</p></div>

  const percentage = goal ? Math.round((goal.books_finished / goal.goal) * 100) : 0

  return (
    <div className="px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-muted">
          Reading Goal {year}
        </p>
        {!editing && (
          <button onClick={handleStart} className="text-xs text-warm-muted hover:text-brand transition-colors">
            {isError || !goal ? 'Add goal' : 'Edit'}
          </button>
        )}
      </div>

      {editing ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') setEditing(false) }}
              autoFocus
              min={1}
              placeholder="books"
              className="w-20 text-sm border border-warm-border rounded-lg px-2.5 py-1.5 text-warm-text bg-transparent outline-none focus:border-brand transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <span className="text-sm text-warm-muted">books in {year}</span>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setEditing(false)} className="text-sm text-warm-muted hover:text-warm-text transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="text-sm text-brand hover:text-brand-dark transition-colors font-medium">
              Save
            </button>
          </div>
        </div>
      ) : isError || !goal ? (
        <p className="text-sm text-warm-muted">No goal set for this year.</p>
      ) : (
        <>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-sm text-warm-muted">
              {goal.books_finished} / {goal.goal} books
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
            {goal.goal - goal.books_finished > 0 ? `${goal.goal - goal.books_finished} books to go` : 'Goal reached!'}
          </p>
        </>
      )}
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

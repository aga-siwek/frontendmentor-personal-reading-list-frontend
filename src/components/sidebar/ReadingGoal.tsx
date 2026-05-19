import { useState } from 'react'
import { useGoal, useSetGoal } from '@/queries/goalQueries'

const ReadingGoal = () => {
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

  if (isLoading) return null

  return (
    <div className="px-4 py-5 border-t border-warm-border">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-muted">
          Reading Goal
        </p>
        {!editing && (
          <button onClick={handleStart} className="text-xs text-warm-muted hover:text-brand transition-colors">
            Edit
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
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)} className="text-xs text-warm-muted hover:text-warm-text transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} className="text-xs text-brand hover:text-brand-dark transition-colors font-medium">
              Save
            </button>
          </div>
        </div>
      ) : isError || !goal ? (
        <button onClick={handleStart} className="text-sm text-brand hover:underline">
          Add goal for {year}
        </button>
      ) : (
        <>
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm text-warm-muted">
              {goal.books_finished} / {goal.goal} books
            </span>
            <span className="text-xs text-warm-muted">{year}</span>
          </div>
          <div className="h-1.5 bg-warm-border rounded-full overflow-hidden mb-1.5">
            <div
              className="h-full bg-brand rounded-full transition-all"
              style={{ width: `${Math.min(Math.round((goal.books_finished / goal.goal) * 100), 100)}%` }}
            />
          </div>
          <p className="text-xs text-warm-muted">
            {Math.round((goal.books_finished / goal.goal) * 100)}% complete · {goal.goal - goal.books_finished} books to go
          </p>
        </>
      )}
    </div>
  )
}

export default ReadingGoal

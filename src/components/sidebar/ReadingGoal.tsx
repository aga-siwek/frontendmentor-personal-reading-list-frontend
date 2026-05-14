import { Link } from 'react-router-dom'
import { useGoal } from '@/queries/goalQueries'

const ReadingGoal = () => {
  const year = new Date().getFullYear()
  const { data: goal, isLoading, isError } = useGoal(year)

  if (isLoading) return null

  if (isError || !goal) {
    return (
      <div className="px-4 py-5 border-t border-warm-border">
        <p className="text-xs font-semibold uppercase tracking-widest text-warm-muted mb-2">
          Reading Goal
        </p>
        <Link
          to="/settings"
          className="text-sm text-brand hover:underline"
        >
          Add goal for {year}
        </Link>
      </div>
    )
  }

  const percentage = Math.round((goal.books_finished / goal.goal) * 100)
  const booksLeft = goal.goal - goal.books_finished

  return (
    <div className="px-4 py-5 border-t border-warm-border">
      <p className="text-xs font-semibold uppercase tracking-widest text-warm-muted mb-2">
        Reading Goal
      </p>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-sm text-warm-muted">
          {goal.books_finished} / {goal.goal} books
        </span>
        <span className="text-xs text-warm-muted">{year}</span>
      </div>
      <div className="h-1.5 bg-warm-border rounded-full overflow-hidden mb-1.5">
        <div
          className="h-full bg-brand rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      <p className="text-xs text-warm-muted">
        {percentage}% complete · {booksLeft} books to go
      </p>
    </div>
  )
}

export default ReadingGoal

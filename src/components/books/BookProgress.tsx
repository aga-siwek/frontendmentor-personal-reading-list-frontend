interface BookProgressProps {
  percentage: number | null
  className?: string
}

const BookProgress = ({ percentage, className = '' }: BookProgressProps) => {
  if (percentage === null) return null

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-warm-muted">Progress</span>
        <span className="text-xs font-medium text-brand">{percentage}%</span>
      </div>
      <div className="h-1 bg-warm-border rounded-full overflow-hidden">
        <div
          className="h-full bg-brand rounded-full transition-all"
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default BookProgress

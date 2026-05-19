import { Skeleton } from '@/components/ui/skeleton'

const BookCardSkeleton = () => {
  return (
    <div className="flex h-44 bg-white rounded-xl shadow-sm border border-warm-border overflow-hidden">
      <Skeleton className="w-28 h-full shrink-0 rounded-none" />

      <div className="flex flex-col justify-between p-4 flex-1">
        <div className="space-y-2">
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="h-3 w-2/5 mt-1" />
          <Skeleton className="h-6 w-24 rounded-md mt-3" />
        </div>

        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1 w-full rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default BookCardSkeleton

import { Skeleton } from '@/app/components/ui/skeleton'

interface LoadingSkeletonProps {
  rows?: number
  type?: 'card' | 'list' | 'metric'
}

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="h-6 w-16 rounded-xl" />
      </div>
      <div className="grid grid-cols-2 gap-3 pt-1">
        <Skeleton className="h-10 rounded-lg" />
        <Skeleton className="h-10 rounded-lg" />
      </div>
    </div>
  )
}

function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3">
      <Skeleton className="h-10 w-10 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-4 rounded" />
    </div>
  )
}

function MetricSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 space-y-2">
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-7 w-1/2" />
      <Skeleton className="h-3 w-2/5" />
    </div>
  )
}

export function LoadingSkeleton({ rows = 3, type = 'card' }: LoadingSkeletonProps) {
  const Item = type === 'card' ? CardSkeleton : type === 'list' ? ListItemSkeleton : MetricSkeleton
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => <Item key={i} />)}
    </div>
  )
}

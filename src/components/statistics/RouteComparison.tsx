import SmallRouteSummary from './SmallRouteSummary'
import useRouteSessions from '@/hooks/useRouteSessions'
import { Skeleton } from '@/components/ui/skeleton'

export default function RouteComparison({ route }: { route: string }) {
  const sessions = useRouteSessions(route)

  if (!sessions) {
    return (
      <div className="flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="w-28 h-20" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {sessions.map((s) => (
        <SmallRouteSummary key={s.id} session={s} />
      ))}
    </div>
  )
}

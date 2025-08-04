import { Badge } from '@/ui/badge'
import { Skeleton } from '@/ui/skeleton'
import { LineChart, Line, ResponsiveContainer } from '@/ui/chart'
import useCommuteRank from '@/hooks/useCommuteRank'
import useRouteSessions from '@/hooks/useRouteSessions'
import type { RouteSession } from '@/lib/api'

const ROUTES = ['River Loop', 'Park Path', 'City Commute']

function hrSeries(sessions: RouteSession[]): { i: number; hr: number }[] {
  return sessions.map((s, i) => {
    const hr =
      s.paceDistribution.reduce((sum, b) => sum + b.upper, 0) /
      s.paceDistribution.length
    return { i, hr }
  })
}

export default function CommuteRank() {
  const rank = useCommuteRank(ROUTES)
  const sessionsA = useRouteSessions(ROUTES[0])
  const sessionsB = useRouteSessions(ROUTES[1])
  const sessionsC = useRouteSessions(ROUTES[2])

  if (!rank || !sessionsA || !sessionsB || !sessionsC) {
    return <Skeleton className="h-32" />
  }

  const sessionMap: Record<string, RouteSession[]> = {
    [ROUTES[0]]: sessionsA,
    [ROUTES[1]]: sessionsB,
    [ROUTES[2]]: sessionsC,
  }

  return (
    <div className="space-y-2">
      {rank.map((r, idx) => (
        <div key={r.route} className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span>{idx + 1}.</span>
            <span>{r.route}</span>
            {idx === 0 && <Badge>Zen Rider</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hrSeries(sessionMap[r.route])} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Line type="monotone" dataKey="hr" stroke="hsl(var(--chart-1))" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <span className="font-mono text-xs">{r.score.toFixed(1)}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

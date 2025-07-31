import { AreaChart, Area, BarChart, Bar, ResponsiveContainer } from '@/components/ui/chart'
import type { RouteSession } from '@/lib/api'

export default function SmallRouteSummary({ session }: { session: RouteSession }) {
  return (
    <div className="w-28" aria-label={`Session ${session.date}`}>
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={session.profile} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Area dataKey="elevation" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" strokeWidth={1} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={session.paceDistribution} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <Bar dataKey="upper" fill="hsl(var(--chart-2))" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-center mt-1">{session.date}</p>
    </div>
  )
}

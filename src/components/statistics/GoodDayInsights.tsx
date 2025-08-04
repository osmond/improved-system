"use client"

import { Card } from "@/ui/card"
import { Skeleton } from "@/ui/skeleton"
import GoodDaySparkline from "./GoodDaySparkline"
import GoodDayTrendline from "./GoodDayTrendline"
import {
  useRunningSessions,
  type SessionPoint,
  type GoodDayTrendPoint,
} from "@/hooks/useRunningSessions"

interface GoodDayInsightsProps {
  sessions?: SessionPoint[] | null
  trend?: GoodDayTrendPoint[] | null
  onSelect?: (s: SessionPoint) => void
  onRangeChange?: (range: [string, string] | null) => void
  highlightDate?: string | null
}

export default function GoodDayInsights({
  sessions: propSessions,
  trend: propTrend,
  onSelect,
  onRangeChange,
  highlightDate,
}: GoodDayInsightsProps) {
  const hookData = useRunningSessions()
  const sessions = propSessions ?? hookData.sessions
  const trend = propTrend ?? hookData.trend

  if (!sessions) return <Skeleton className="h-32" />
  if (!sessions.length) return null

  const good = sessions.filter((s) => s.good)
  if (!good.length) return null

  // Top improvements
  const top = [...good].sort((a, b) => b.paceDelta - a.paceDelta).slice(0, 3)

  // Time-of-day clusters
  const clusterDefs = [
    { label: "Night", range: [0, 5] as [number, number] },
    { label: "Morning", range: [5, 12] as [number, number] },
    { label: "Afternoon", range: [12, 17] as [number, number] },
    { label: "Evening", range: [17, 24] as [number, number] },
  ]
  const clusters = clusterDefs
    .map(({ label, range }) => ({
      label,
      count: sessions.filter((s) => s.startHour >= range[0] && s.startHour < range[1]).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count)

  // Recent trend change
  const sorted = [...good].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
  )
  const last = sorted.slice(-7)
  const prev = sorted.slice(-14, -7)
  const lastAvg = last.reduce((sum, s) => sum + s.paceDelta, 0) / last.length
  const prevAvg = prev.length
    ? prev.reduce((sum, s) => sum + s.paceDelta, 0) / prev.length
    : lastAvg
  const trendChange = lastAvg - prevAvg

  const now = new Date()
  const trendData = Array.from({ length: 30 }, (_, i) => {
    const day = new Date(now)
    day.setDate(now.getDate() - (29 - i))
    const key = day.toISOString().slice(0, 10)
    const count = good.filter((s) => s.start.slice(0, 10) === key).length
    return { date: key, count }
  })

  return (
    <Card className="p-4 space-y-4 text-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div>
            Recent pace delta: {lastAvg.toFixed(2)} min/mi (
            {trendChange >= 0 ? "+" : ""}
            {trendChange.toFixed(2)} vs prev 7 runs)
          </div>
        </div>
        <div className="sm:w-40 w-full space-y-2">
          <GoodDaySparkline
            data={trendData}
            onRangeChange={onRangeChange}
            highlightDate={highlightDate}
          />
          {trend && <GoodDayTrendline data={trend.slice(-30)} />}
        </div>
      </div>
      {clusters.length > 0 && (
        <div>
          <h2 className="font-medium">Time of day clusters</h2>
          <div className="flex gap-2 flex-wrap">
            {clusters.map((c) => (
              <span key={c.label} className="px-2 py-1 bg-muted rounded">
                {c.label}: {c.count}
              </span>
            ))}
          </div>
        </div>
      )}
      {top.length > 0 && (
        <div>
          <h2 className="font-medium">Top improvements</h2>
          <ol className="list-decimal pl-4 space-y-1">
            {top.map((s) => (
              <li key={s.id}>
                <button
                  className="hover:underline"
                  onClick={() => onSelect?.(s)}
                >
                  {new Date(s.start).toLocaleDateString()}: {s.paceDelta.toFixed(2)} min/mi faster
                </button>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  )
}


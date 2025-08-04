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
import { usePaceDeltaBenchmark } from "@/hooks/usePaceDeltaBenchmark"

interface GoodDayInsightsProps {
  sessions?: SessionPoint[] | null
  trend?: GoodDayTrendPoint[] | null
  error?: Error | null
  onSelect?: (s: SessionPoint) => void
  onRangeChange?: (range: [string, string] | null) => void
  highlightDate?: string | null
}

export default function GoodDayInsights(props: GoodDayInsightsProps) {
  const { sessions: propSessions, trend: propTrend } = props
  if (propSessions === undefined || propTrend === undefined) {
    return <GoodDayInsightsWithHook {...props} />
  }
  return <GoodDayInsightsContent {...props} />
}

function GoodDayInsightsWithHook(props: GoodDayInsightsProps) {
  const hookData = useRunningSessions()
  return (
    <GoodDayInsightsContent
      {...props}
      sessions={props.sessions ?? hookData.sessions}
      trend={props.trend ?? hookData.trend}
      error={props.error ?? hookData.error}
    />
  )
}

function GoodDayInsightsContent({
  sessions,
  trend,
  error,
  onSelect,
  onRangeChange,
  highlightDate,
}: GoodDayInsightsProps) {
  const benchmark = usePaceDeltaBenchmark()

  if (error)
    return (
      <div className="text-sm text-red-500">
        Unable to load session insights.
      </div>
    )

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

  let p50Pct = 0,
    p75Pct = 0,
    p90Pct = 0,
    userPct = 0
  if (benchmark) {
    const max = Math.max(benchmark.p90, lastAvg)
    p50Pct = (benchmark.p50 / max) * 100
    p75Pct = (benchmark.p75 / max) * 100
    p90Pct = (benchmark.p90 / max) * 100
    userPct = (lastAvg / max) * 100
  }

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
          {benchmark && (
            <div className="space-y-1">
              <div className="relative h-2 bg-muted rounded">
                <div
                  className="absolute h-full"
                  style={{
                    width: `${p50Pct}%`,
                    background: "hsl(var(--chart-4))",
                  }}
                />
                <div
                  className="absolute h-full"
                  style={{
                    left: `${p50Pct}%`,
                    width: `${p75Pct - p50Pct}%`,
                    background: "hsl(var(--chart-5))",
                  }}
                />
                <div
                  className="absolute h-full"
                  style={{
                    left: `${p75Pct}%`,
                    width: `${p90Pct - p75Pct}%`,
                    background: "hsl(var(--chart-6))",
                  }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2"
                  style={{ left: `${userPct}%` }}
                >
                  <div className="w-0.5 h-4 bg-primary -translate-x-1/2" />
                </div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{benchmark.p50.toFixed(2)}</span>
                <span>{benchmark.p75.toFixed(2)}</span>
                <span>{benchmark.p90.toFixed(2)}</span>
              </div>
            </div>
          )}
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


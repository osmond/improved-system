"use client"

import Map, { Marker } from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet"
import { SessionPoint, useRunningSessions } from "@/hooks/useRunningSessions"
import useSessionTimeseries from "@/hooks/useSessionTimeseries"
import { Input } from "@/ui/input"
import { Button } from "@/ui/button"
import { Badge } from "@/ui/badge"
import { useEffect, useState } from "react"
import { getSessionMeta, updateSessionMeta } from "@/lib/sessionMeta"
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area,
  CartesianGrid,
  Tooltip as ChartTooltip,
  type ChartConfig,
} from "@/ui/chart"

interface SessionDetailDrawerProps {
  session: SessionPoint | null
  onClose: () => void
}

export default function SessionDetailDrawer({ session, onClose }: SessionDetailDrawerProps) {
  const series = useSessionTimeseries(session?.id ?? null)
  const sessions = useRunningSessions()
  const [typical, setTypical] = useState<SessionPoint | null>(null)
  const [nextBest, setNextBest] = useState<SessionPoint | null>(null)
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isFalsePositive, setIsFalsePositive] = useState(false)

  useEffect(() => {
    if (!session || !sessions) {
      setTypical(null)
      setNextBest(null)
      return
    }
    const others = sessions.filter((s) => s.id !== session.id)
    if (others.length) {
      let best = others[0]
      let bestDist = Infinity
      for (const s of others) {
        const dist = Math.hypot(
          s.temperature - session.temperature,
          s.humidity - session.humidity,
          s.startHour - session.startHour,
          s.wind - session.wind,
        )
        if (dist < bestDist) {
          bestDist = dist
          best = s
        }
      }
      setTypical(best)
    } else {
      setTypical(null)
    }
    const good = others.filter((s) => s.good && !s.isFalsePositive)
    setNextBest(good.sort((a, b) => b.paceDelta - a.paceDelta)[0] ?? null)
  }, [session, sessions])

  useEffect(() => {
    if (!session) return
    const meta = getSessionMeta(session.id)
    setTags(meta.tags)
    setIsFalsePositive(meta.isFalsePositive)
  }, [session])

  function saveMeta(nextTags: string[], nextFalse: boolean) {
    if (!session) return
    updateSessionMeta(session.id, { tags: nextTags, isFalsePositive: nextFalse })
    window.dispatchEvent(new Event('sessionMetaUpdated'))
  }

  function addTag() {
    if (!session) return
    const t = tagInput.trim()
    if (!t) return
    const next = [...tags, t]
    setTags(next)
    setTagInput("")
    saveMeta(next, isFalsePositive)
  }

  function removeTag(tag: string) {
    if (!session) return
    const next = tags.filter((t) => t !== tag)
    setTags(next)
    saveMeta(next, isFalsePositive)
  }

  function toggleFalsePositive() {
    if (!session) return
    const next = !isFalsePositive
    setIsFalsePositive(next)
    saveMeta(tags, next)
  }
  const chartConfig = {
    actual: { label: "Actual", color: "hsl(var(--chart-1))" },
    expected: { label: "Expected", color: "hsl(var(--chart-2))" },
    temperature: { label: "Temp °F", color: "hsl(var(--chart-3))" },
  } satisfies ChartConfig

  interface Metric {
    label: string
    accessor: (s: SessionPoint) => number
    format: (n: number) => string
    diff: number
  }

  const metrics: Metric[] = [
    {
      label: "Expected (min/mi)",
      accessor: (s) => s.pace + s.paceDelta,
      format: (n) => n.toFixed(2),
      diff: 0.01,
    },
    {
      label: "Actual (min/mi)",
      accessor: (s) => s.pace,
      format: (n) => n.toFixed(2),
      diff: 0.01,
    },
    {
      label: "Δ (min/mi)",
      accessor: (s) => s.paceDelta,
      format: (n) => n.toFixed(2),
      diff: 0.01,
    },
    {
      label: "Heart Rate (bpm)",
      accessor: (s) => s.heartRate,
      format: (n) => n.toString(),
      diff: 1,
    },
    {
      label: "Temp (°F)",
      accessor: (s) => s.temperature,
      format: (n) => n.toString(),
      diff: 1,
    },
    {
      label: "Humidity (%)",
      accessor: (s) => s.humidity,
      format: (n) => n.toString(),
      diff: 1,
    },
    {
      label: "Wind (mph)",
      accessor: (s) => s.wind,
      format: (n) => n.toString(),
      diff: 1,
    },
    {
      label: "Start Hour",
      accessor: (s) => s.startHour,
      format: (n) => n.toString(),
      diff: 1,
    },
    {
      label: "Duration (min)",
      accessor: (s) => s.duration,
      format: (n) => n.toString(),
      diff: 1,
    },
  ]

  function renderCell(base: number, comp: number, m: Metric) {
    const delta = comp - base
    const highlight = Math.abs(delta) >= m.diff
    return (
      <td className={highlight ? "font-semibold text-primary" : ""}>
        {m.format(comp)}
        {highlight ? ` (${delta > 0 ? "+" : ""}${m.format(Math.abs(delta))})` : ""}
      </td>
    )
  }
  return (
    <Sheet open={!!session} onOpenChange={(open) => { if (!open) onClose() }}>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle>Session Details</SheetTitle>
        </SheetHeader>
        {session && (
          <div className="space-y-4">
            <div className="h-48 w-full">
              <Map
                mapLib={maplibregl}
                mapStyle="https://demotiles.maplibre.org/style.json"
                initialViewState={{ longitude: session.lon, latitude: session.lat, zoom: 12 }}
                attributionControl={false}
                style={{ width: "100%", height: "100%" }}
              >
                <Marker longitude={session.lon} latitude={session.lat}>
                  <circle r={4} fill="hsl(var(--primary))" />
                </Marker>
              </Map>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-left"></th>
                  <th className="text-left">This Run</th>
                  {typical && <th className="text-left">Typical</th>}
                  {nextBest && <th className="text-left">Next Good</th>}
                </tr>
              </thead>
              <tbody>
                {metrics.map((m) => {
                  const base = m.accessor(session)
                  return (
                    <tr key={m.label}>
                      <td className="pr-2 font-medium">{m.label}</td>
                      <td>{m.format(base)}</td>
                      {typical ? renderCell(base, m.accessor(typical), m) : null}
                      {nextBest ? renderCell(base, m.accessor(nextBest), m) : null}
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <div className="space-y-2 text-sm">
              <div className="flex flex-wrap gap-1">
                {tags.map((t) => (
                  <Badge key={t} variant="secondary" className="cursor-pointer" onClick={() => removeTag(t)}>
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1"
                />
                <Button size="sm" onClick={addTag}>
                  Add
                </Button>
              </div>
              <Button variant={isFalsePositive ? "default" : "outline"} size="sm" onClick={toggleFalsePositive}>
                {isFalsePositive ? "Marked False Positive" : "Mark False Positive"}
              </Button>
            </div>
            {series && (
              <ChartContainer config={chartConfig} className="h-40">
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="t" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="pace" tickLine={false} axisLine={false} />
                  <YAxis yAxisId="temp" orientation="right" tickLine={false} axisLine={false} />
                  <ChartTooltip />
                  <Area
                    yAxisId="temp"
                    type="monotone"
                    dataKey="temperature"
                    stroke="none"
                    fill="var(--color-temperature)"
                    opacity={0.3}
                  />
                  <Line
                    yAxisId="pace"
                    type="monotone"
                    dataKey="actual"
                    stroke="var(--color-actual)"
                    dot={false}
                  />
                  <Line
                    yAxisId="pace"
                    type="monotone"
                    dataKey="expected"
                    stroke="var(--color-expected)"
                    strokeDasharray="4 2"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

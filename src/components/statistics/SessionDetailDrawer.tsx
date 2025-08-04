"use client"

import Map, { Marker } from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/ui/sheet"
import { SessionPoint } from "@/hooks/useRunningSessions"
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
  const baseline = session ? session.pace + session.paceDelta : 0
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isFalsePositive, setIsFalsePositive] = useState(false)

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
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="col-span-2">
                Expected / Actual / Δ: {baseline.toFixed(2)} / {session.pace.toFixed(2)} / {session.paceDelta.toFixed(2)}
                {' '}min/mi
              </span>
              <span>Heart Rate: {session.heartRate} bpm</span>
              <span>Temp: {session.temperature}°F</span>
              <span>Humidity: {session.humidity}%</span>
              <span>Wind: {session.wind} mph</span>
              <span>Start Hour: {session.startHour}</span>
              <span>Duration: {session.duration} min</span>
            </div>
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

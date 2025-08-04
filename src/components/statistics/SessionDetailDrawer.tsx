"use client"

import Map, { Marker } from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useRunningSessions, type SessionPoint } from "@/hooks/useRunningSessions"
import useSessionTimeseries from "@/hooks/useSessionTimeseries"
import { Fragment, useMemo } from "react"
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
} from "@/components/ui/chart"

interface SessionDetailDrawerProps {
  session: SessionPoint | null
  onClose: () => void
}

export default function SessionDetailDrawer({ session, onClose }: SessionDetailDrawerProps) {
  const sessions = useRunningSessions()
  const series = useSessionTimeseries(session?.id ?? null)

  const { typical, nextBest } = useMemo(() => {
    if (!sessions || !session) return { typical: null, nextBest: null }
    const similar = sessions.filter(
      (s) => s.cluster === session.cluster && s.id !== session.id,
    )
    let typical: SessionPoint | null = null
    for (const s of similar) {
      if (!typical || Math.abs(s.paceDelta) < Math.abs(typical.paceDelta)) {
        typical = s
      }
    }
    const goodSessions = similar
      .filter((s) => s.good)
      .sort((a, b) => b.paceDelta - a.paceDelta)
    const nextBest = goodSessions[0] ?? null
    return { typical, nextBest }
  }, [sessions, session])

  function diffClass(
    val: number,
    base: number,
    betterLower = true,
  ): string {
    if (val === base) return ""
    const better = betterLower ? val < base : val > base
    return better ? "text-green-600 font-medium" : "text-red-600 font-medium"
  }

  const metrics = [
    {
      label: "Expected Pace (min/mi)",
      getter: (s: SessionPoint) => s.pace + s.paceDelta,
      format: (v: number) => v.toFixed(2),
      betterLower: true,
    },
    {
      label: "Actual Pace (min/mi)",
      getter: (s: SessionPoint) => s.pace,
      format: (v: number) => v.toFixed(2),
      betterLower: true,
    },
    {
      label: "Δ Pace (min/mi)",
      getter: (s: SessionPoint) => s.paceDelta,
      format: (v: number) => v.toFixed(2),
      betterLower: false,
    },
    {
      label: "Heart Rate (bpm)",
      getter: (s: SessionPoint) => s.heartRate,
      format: (v: number) => v.toString(),
      betterLower: true,
    },
    {
      label: "Temp (°F)",
      getter: (s: SessionPoint) => s.temperature,
      format: (v: number) => v.toString(),
    },
    {
      label: "Humidity (%)",
      getter: (s: SessionPoint) => s.humidity,
      format: (v: number) => v.toString(),
    },
    {
      label: "Wind (mph)",
      getter: (s: SessionPoint) => s.wind,
      format: (v: number) => v.toString(),
      betterLower: true,
    },
    {
      label: "Start Hour",
      getter: (s: SessionPoint) => s.startHour,
      format: (v: number) => v.toString(),
    },
    {
      label: "Duration (min)",
      getter: (s: SessionPoint) => s.duration,
      format: (v: number) => v.toString(),
    },
  ] as const

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
            <div className="grid grid-cols-4 gap-2 text-sm">
              <span />
              <span className="font-medium">This</span>
              <span className="font-medium">Typical</span>
              <span className="font-medium">Next Good</span>
              {metrics.map(({ label, getter, format, betterLower }) => (
                <Fragment key={label}>
                  <span>{label}</span>
                  <span>{format(getter(session))}</span>
                  <span
                    className={
                      typical
                        ? diffClass(
                            getter(typical),
                            getter(session),
                            betterLower,
                          )
                        : ""
                    }
                  >
                    {typical ? format(getter(typical)) : "-"}
                  </span>
                  <span
                    className={
                      nextBest
                        ? diffClass(
                            getter(nextBest),
                            getter(session),
                            betterLower,
                          )
                        : ""
                    }
                  >
                    {nextBest ? format(getter(nextBest)) : "-"}
                  </span>
                </Fragment>
              ))}
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

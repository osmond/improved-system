"use client"

import Map, { Marker } from "react-map-gl/maplibre"
import maplibregl from "maplibre-gl"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { SessionPoint } from "@/hooks/useRunningSessions"
import useSessionTimeseries from "@/hooks/useSessionTimeseries"
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
  const series = useSessionTimeseries(session?.id ?? null)
  const baseline = session ? session.pace + session.paceDelta : 0
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

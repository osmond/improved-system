"use client"

import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { TooltipProps } from "recharts"
import ChartCard from "@/components/dashboard/ChartCard"
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/components/ui/skeleton"

const config = {
  good: { label: "Good Day", color: "hsl(var(--chart-6))" },
} satisfies Record<string, unknown>

interface GoodDayMapProps {
  data: SessionPoint[] | null
}

export default function GoodDayMap({ data }: GoodDayMapProps) {
  if (!data) return <Skeleton className="h-64" />

  const goodSessions = data.filter((d) => d.good)

  return (
    <ChartCard
      title="Good Day Sessions"
      description="Sessions exceeding expectations"
    >
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="X" />
          <YAxis type="number" dataKey="y" name="Y" />
          <ChartTooltip content={<GoodDayTooltip />} />
          <Scatter
            data={goodSessions}
            fill="hsl(var(--chart-6))"
            shape="star"
            animationDuration={300}
          />
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  )
}

function GoodDayTooltip(props: TooltipProps<number, string>) {
  const { active, payload } = props
  if (!(active && payload && payload.length)) return null

  const session = payload[0].payload as SessionPoint
  return (
    <ChartTooltipContent
      active={active}
      payload={payload}
      hideLabel
      hideIndicator
      formatter={() => (
        <div className="grid gap-1">
          <span>Pace: {session.pace.toFixed(2)} min/mi</span>
          <span>Heart Rate: {session.heartRate} bpm</span>
          <span>Temp: {session.temperature}°F</span>
          <span>Humidity: {session.humidity}%</span>
          <span>Wind: {session.wind} mph</span>
        </div>
      )}
    />
  )
}


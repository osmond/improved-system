"use client"

import {
  ChartContainer,
  ScatterChart,
  Scatter,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { TooltipProps } from "recharts"
import ChartCard from "@/components/dashboard/ChartCard"
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/components/ui/skeleton"
import { scaleLinear } from "d3-scale"
import type { ChartConfig } from "@/components/ui/chart"
import { useState } from "react"
import SessionDetailDrawer from "./SessionDetailDrawer"

interface GoodDayMapProps {
  data: SessionPoint[] | null
  condition?: string | null
  hourRange?: [number, number]
}

export default function GoodDayMap({ data, condition, hourRange = [0, 23] }: GoodDayMapProps) {
  if (!data) return <Skeleton className="h-64" />

  const goodSessions = data.filter(
    (d) =>
      d.good &&
      (!condition || d.condition === condition) &&
      d.startHour >= hourRange[0] &&
      d.startHour <= hourRange[1],
  )

  if (!goodSessions.length)
    return (
      <ChartCard
        title="Good Day Sessions"
        description="Sessions exceeding expectations"
      >
        <div className="flex items-center justify-center h-64 md:h-80 lg:h-96 text-sm text-muted-foreground">
          No sessions match the selected filters.
        </div>
      </ChartCard>
    )
  const style = getComputedStyle(document.documentElement)
  const start = `hsl(${style.getPropertyValue("--chart-4")})`
  const end = `hsl(${style.getPropertyValue("--chart-6")})`
  const config = {
    small: { label: "Smaller Δ", color: start },
    large: { label: "Larger Δ", color: end },
  } satisfies ChartConfig

  const minDelta = Math.min(...goodSessions.map((d) => d.paceDelta))
  const maxDelta = Math.max(...goodSessions.map((d) => d.paceDelta))
  const colorScale = scaleLinear<string>().domain([minDelta, maxDelta]).range([start, end])
  const colored = goodSessions.map((s) => ({ ...s, fill: colorScale(s.paceDelta) }))
  const [active, setActive] = useState<SessionPoint | null>(null)

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
          <ChartLegend
            payload={[
              { value: "small", type: "square", color: start, dataKey: "small" },
              { value: "large", type: "square", color: end, dataKey: "large" },
            ]}
            content={<ChartLegendContent />}
          />
          <Scatter
            data={colored}
            shape="star"
            animationDuration={300}
            onClick={(data) => setActive(data as SessionPoint)}
            cursor="pointer"
          >
            {colored.map((entry, idx) => (
              <Cell key={`cell-${idx}`} fill={entry.fill} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
      <SessionDetailDrawer session={active} onClose={() => setActive(null)} />
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
          <span>Δ Pace: {session.paceDelta.toFixed(2)} min/mi</span>
          <span>Heart Rate: {session.heartRate} bpm</span>
          <span>Temp: {session.temperature}°F</span>
          <span>Humidity: {session.humidity}%</span>
          <span>Wind: {session.wind} mph</span>
        </div>
      )}
    />
  )
}


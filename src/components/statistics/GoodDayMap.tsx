"use client"

import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"
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
          <ChartTooltip />
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


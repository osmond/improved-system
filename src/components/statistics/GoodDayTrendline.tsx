"use client"

import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart"
import type { ChartConfig } from "@/ui/chart"
import { GoodDayTrendPoint } from "@/hooks/useRunningSessions"

interface GoodDayTrendlineProps {
  data: GoodDayTrendPoint[]
}

export default function GoodDayTrendline({ data }: GoodDayTrendlineProps) {
  const config = {
    avg: { label: "Good-day rate", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-16 w-full">
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <XAxis dataKey="date" hide />
        <YAxis domain={[0, 1]} hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          type="monotone"
          dataKey="avg"
          stroke={config.avg.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="lower"
          stroke={config.avg.color}
          strokeDasharray="4 4"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="upper"
          stroke={config.avg.color}
          strokeDasharray="4 4"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

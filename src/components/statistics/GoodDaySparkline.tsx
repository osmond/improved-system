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

interface TrendPoint {
  date: string
  count: number
}

interface GoodDaySparklineProps {
  data: TrendPoint[]
}

export default function GoodDaySparkline({ data }: GoodDaySparklineProps) {
  const config = {
    count: { label: "Good sessions", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-16 w-full">
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <XAxis dataKey="date" hide />
        <YAxis allowDecimals={false} hide />
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke={config.count.color}
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}

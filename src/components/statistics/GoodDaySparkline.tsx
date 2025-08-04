"use client"

import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
  Brush,
  ReferenceLine,
} from "@/ui/chart"
import type { ChartConfig } from "@/ui/chart"

interface TrendPoint {
  date: string
  count: number
}

interface GoodDaySparklineProps {
  data: TrendPoint[]
  onRangeChange?: (range: [string, string] | null) => void
  highlightDate?: string | null
}

export default function GoodDaySparkline({
  data,
  onRangeChange,
  highlightDate,
}: GoodDaySparklineProps) {
  const config = {
    count: { label: "Good sessions", color: "hsl(var(--chart-1))" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-16 w-full">
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <XAxis dataKey="date" hide />
        <YAxis allowDecimals={false} hide />
        {highlightDate && (
          <ReferenceLine x={highlightDate} strokeWidth={2} stroke="hsl(var(--chart-4))" />
        )}
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Line
          type="monotone"
          dataKey="count"
          stroke={config.count.color}
          strokeWidth={2}
          dot={false}
        />
        <Brush
          dataKey="date"
          height={8}
          travellerWidth={8}
          onChange={(range) => {
            if (
              typeof range?.startIndex === "number" &&
              typeof range?.endIndex === "number"
            ) {
              const start = data[range.startIndex].date
              const end = data[range.endIndex].date
              if (range.startIndex === 0 && range.endIndex === data.length - 1) {
                onRangeChange?.(null)
              } else {
                onRangeChange?.([start, end])
              }
            }
          }}
        />
      </LineChart>
    </ChartContainer>
  )
}

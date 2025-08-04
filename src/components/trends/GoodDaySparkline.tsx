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
  delta?: number
  count?: number
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
  const chartData = data.map((d) => {
    const value = d.delta ?? d.count ?? 0
    return {
      date: d.date,
      positive: value >= 0 ? value : null,
      negative: value < 0 ? value : null,
    }
  })

  const config = {
    positive: { label: "Faster", color: "hsl(142.1 76.2% 36.3%)" },
    negative: { label: "Slower", color: "hsl(0 84.2% 60.2%)" },
  } satisfies ChartConfig

  return (
    <ChartContainer config={config} className="h-16 w-full">
      <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <XAxis dataKey="date" hide />
        <YAxis hide />
        {highlightDate && (
          <ReferenceLine x={highlightDate} strokeWidth={2} stroke="hsl(var(--chart-4))" />
        )}
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(d) =>
                new Date(d).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              }
              formatter={(value: number, name, item) => (
                <div className="flex items-center gap-2">
                  <div
                    className="h-2 w-2 rounded"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-mono font-medium">
                    {value >= 0 ? "+" : ""}
                    {value.toFixed(2)} min/mi
                  </span>
                </div>
              )}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="positive"
          stroke={config.positive.color}
          strokeWidth={2}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="negative"
          stroke={config.negative.color}
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
              const start = chartData[range.startIndex].date
              const end = chartData[range.endIndex].date
              if (range.startIndex === 0 && range.endIndex === chartData.length - 1) {
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

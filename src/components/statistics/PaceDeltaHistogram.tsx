"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

interface PaceDeltaBin {
  start: number
  end: number
  count: number
  color: string
}

interface PaceDeltaHistogramProps {
  bins: PaceDeltaBin[]
  onHover: (range: [number, number] | null) => void
}

export default function PaceDeltaHistogram({ bins, onHover }: PaceDeltaHistogramProps) {
  const config = bins.reduce((acc, bin, index) => {
    acc[`bin${index}`] = {
      label: `${bin.start.toFixed(2)}–${bin.end.toFixed(2)} min/mi`,
      color: bin.color,
    }
    return acc
  }, {} as ChartConfig)

  const data = bins.map((bin, index) => ({
    name: `bin${index}`,
    count: bin.count,
    start: bin.start,
    end: bin.end,
    color: bin.color,
  }))

  return (
    <ChartContainer config={config} className="h-32 mt-4">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" hide />
        <YAxis allowDecimals={false} />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(name) =>
                config[name as keyof typeof config]?.label
              }
            />
          }
        />
        <ChartLegend
          payload={data.map((d) => ({
            value: d.name,
            type: "square",
            color: d.color,
            dataKey: d.name,
          }))}
          content={<ChartLegendContent />}
        />
        <Bar dataKey="count">
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color}
              onMouseEnter={() => onHover([entry.start, entry.end])}
              onMouseLeave={() => onHover(null)}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}


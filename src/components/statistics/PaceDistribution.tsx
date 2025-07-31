"use client"

import {
  ChartContainer,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"

const violinData = [
  { pace: "5:00", density: 0.1 },
  { pace: "5:30", density: 0.3 },
  { pace: "6:00", density: 0.6 },
  { pace: "6:30", density: 0.9 },
  { pace: "7:00", density: 0.6 },
  { pace: "7:30", density: 0.3 },
  { pace: "8:00", density: 0.1 },
]

const config = {
  density: { label: "Density", color: "var(--chart-7)" },
} satisfies Record<string, unknown>

export default function PaceDistribution() {
  return (
    <ChartContainer config={config} className="h-64" title="Pace Distribution">
      <AreaChart data={violinData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="pace" tickLine={false} axisLine={false} />
        <ChartTooltip />
        <Area
          type="monotone"
          dataKey="density"
          stroke="var(--chart-7)"
          fill="var(--chart-7)"
          fillOpacity={0.4}
          dot={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

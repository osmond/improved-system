"use client"

import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"

const runDistanceData = [
  { range: "1mi", count: 1125 },
  { range: "2mi", count: 739 },
  { range: "3mi", count: 459 },
  { range: "4mi", count: 472 },
  { range: "5-6mi", count: 596 },
  { range: "7-8mi", count: 157 },
  { range: "9-10mi", count: 51 },
  { range: "11-12mi", count: 53 },
  { range: "13-14mi", count: 26 },
  { range: "15+mi", count: 4 },
]

const config = {
  count: { label: "Count", color: "var(--chart-4)" },
} satisfies Record<string, unknown>

export default function RunDistances() {
  return (
    <ChartCard title="Run Distances">
      <ChartContainer config={config} className="h-60">
        <BarChart layout="vertical" data={runDistanceData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tickLine={false} axisLine={false} />
          <ChartTooltip />
          <Bar dataKey="count" fill="var(--chart-4)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

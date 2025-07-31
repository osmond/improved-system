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

const scatterData = Array.from({ length: 200 }, () => ({
  pace: 6 + Math.random() * 2,
  hr: 120 + Math.random() * 40,
}))

const config = {
  pace: { label: "Pace", color: "var(--chart-9)" },
  hr: { label: "Heart Rate", color: "var(--chart-10)" },
} satisfies Record<string, unknown>

export default function PaceVsHR() {
  return (
    <ChartCard title="Pace vs Heart Rate">
      <ChartContainer config={config} className="h-64">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pace" name="Pace (min/mi)" />
          <YAxis dataKey="hr" name="Heart Rate (bpm)" />
          <ChartTooltip />
          <Scatter data={scatterData} fill="var(--chart-9)" />
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  )
}

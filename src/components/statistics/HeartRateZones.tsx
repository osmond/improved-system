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
import { useChartSelection } from "@/components/dashboard/ChartSelectionContext"
import { useRunningStats } from "@/hooks/useRunningStats"

const config = {
  bpm: { label: "Heart Rate", color: "var(--chart-8)" },
} satisfies Record<string, unknown>

export default function HeartRateZones() {
  const { range } = useChartSelection()
  const stats = useRunningStats(range)

  if (!stats) return null

  return (
    <ChartCard title="Heart Rate Zones">
      <ChartContainer config={config} className="h-60">
        <BarChart data={stats.heartRateZones}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="zone" tickLine={false} axisLine={false} />
          <ChartTooltip />
          <Bar dataKey="bpm" fill="var(--chart-8)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

"use client"

import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { useRunningStats } from "@/hooks/useRunningStats"
import { Skeleton } from "@/components/ui/skeleton"

const config = {
  pace: { label: "Pace", color: "var(--chart-7)" },
} as const

export default function PaceVsTemperature() {
  const stats = useRunningStats()
  if (!stats) return <Skeleton className="h-60" />
  const data = stats.paceEnvironment.map((p) => ({
    temperature: p.temperature,
    pace: p.pace,
  }))
  return (
    <ChartCard title="Pace vs Temperature" description="Average pace per day">
      <ChartContainer config={config} className="h-60">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="temperature" name="Temp (F)" />
          <YAxis dataKey="pace" name="Pace" />
          <ChartTooltip />
          <Line dataKey="pace" stroke={config.pace.color} dot={false} />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}

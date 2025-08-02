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
import { useRunningStats } from "@/hooks/useRunningStats"
import { Skeleton } from "@/components/ui/skeleton"

const config = {
  count: { label: "Runs", color: "var(--chart-5)" },
} as const

export default function WeatherConditionBar() {
  const stats = useRunningStats()
  if (!stats) return <Skeleton className="h-60" />
  return (
    <ChartCard title="Runs by Weather" description="Frequency by condition">
      <ChartContainer config={config} className="h-60 md:h-80 lg:h-96">
        <BarChart data={stats.weatherConditions}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <ChartTooltip />
          <Bar dataKey="count" fill={config.count.color} animationDuration={300} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

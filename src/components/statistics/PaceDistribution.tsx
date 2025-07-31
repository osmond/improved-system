"use client"

import {
  ChartContainer,
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { useChartSelection } from "@/components/dashboard/ChartSelectionContext"
import { useRunningStats } from "@/hooks/useRunningStats"
import { Skeleton } from "@/components/ui/skeleton"

const config = {
  density: { label: "Density", color: "var(--chart-7)" },
} satisfies Record<string, unknown>

export default function PaceDistribution() {
  const { range } = useChartSelection()
  const stats = useRunningStats(range)

  if (!stats) return <Skeleton className="h-64" />

  return (
    <ChartCard title="Pace Distribution">
      <ChartContainer config={config} className="h-64">
        <AreaChart data={stats.paceDistribution}>
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
            animationDuration={300}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

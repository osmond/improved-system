"use client"

import {
  ChartContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { useBenchmarkStats } from "@/hooks/useBenchmarkStats"
import { Skeleton } from "@/components/ui/skeleton"
import type { ChartConfig } from "@/components/ui/chart"

export default function PeerBenchmarkBands() {
  const stats = useBenchmarkStats()

  if (!stats) {
    return <Skeleton className="h-64" />
  }

  const paceData = stats.pace.map((d) => ({
    date: d.date,
    p50: d.p50,
    band75: d.p75 - d.p50,
    band90: d.p90 - d.p75,
    user: d.user,
  }))

  const config = {
    p50: { label: "50th", color: "hsl(var(--chart-4))" },
    band75: { label: "75th", color: "hsl(var(--chart-5))" },
    band90: { label: "90th", color: "hsl(var(--chart-6))" },
    user: { label: "You", color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig

  return (
    <ChartCard
      title="Pace Benchmark"
      description="Percentile bands compared to peers"
    >
      <ChartContainer config={config} className="h-64">
        <AreaChart data={paceData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <YAxis />
          <ChartTooltip
            content={
              <ChartTooltipContent
                nameKey="user"
                labelFormatter={(d) =>
                  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Area
            type="monotone"
            stackId="bands"
            dataKey="p50"
            stroke={config.p50.color}
            fill={config.p50.color}
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            stackId="bands"
            dataKey="band75"
            stroke={config.band75.color}
            fill={config.band75.color}
            fillOpacity={0.3}
          />
          <Area
            type="monotone"
            stackId="bands"
            dataKey="band90"
            stroke={config.band90.color}
            fill={config.band90.color}
            fillOpacity={0.3}
          />
          <Line type="monotone" dataKey="user" stroke={config.user.color} dot={false} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

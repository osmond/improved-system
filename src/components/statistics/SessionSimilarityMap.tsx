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
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/components/ui/skeleton"

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

const config = {
  0: { label: "Cluster 1", color: colors[0] },
  1: { label: "Cluster 2", color: colors[1] },
  2: { label: "Cluster 3", color: colors[2] },
  good: { label: "Good Day", color: "hsl(var(--chart-6))" },
} satisfies Record<string, unknown>

interface SessionSimilarityMapProps {
  data: SessionPoint[] | null
}

export default function SessionSimilarityMap({
  data,
}: SessionSimilarityMapProps) {
  if (!data) return <Skeleton className="h-64" />

  const clusters = Array.from(new Set(data.map((d) => d.cluster)))

  return (
    <ChartCard
      title="Session Similarity"
      description="Similarity of recent runs"
    >
      <ChartContainer config={config} className="h-64">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="X" />
          <YAxis type="number" dataKey="y" name="Y" />
          <ChartTooltip />
          {clusters.map((c) => (
            <Scatter
              key={c}
              data={data.filter((d) => d.cluster === c)}
              fill={colors[c % colors.length]}
              animationDuration={300}
            />
          ))}
          <Scatter
            data={data.filter((d) => d.good)}
            fill="hsl(var(--chart-6))"
            shape="star"
          />
        </ScatterChart>
      </ChartContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {clusters.map((c) => {
          const clusterData = data.filter((d) => d.cluster === c)
          const avgTemp =
            clusterData.reduce((sum, d) => sum + d.temperature, 0) /
            clusterData.length
          const avgStart =
            clusterData.reduce((sum, d) => sum + d.startHour, 0) /
            clusterData.length
          return (
            <div key={c} className="flex flex-col items-center">
              <ChartContainer className="h-32 w-full" config={{}}>
                <ScatterChart>
                  <XAxis type="number" dataKey="x" hide />
                  <YAxis type="number" dataKey="y" hide />
                  <Scatter
                    data={clusterData}
                    fill={colors[c % colors.length]}
                  />
                </ScatterChart>
              </ChartContainer>
              <p className="mt-2 text-xs text-muted-foreground text-center">
                Avg temp {avgTemp.toFixed(1)}°F · Start {avgStart.toFixed(0)}h
              </p>
            </div>
          )
        })}
      </div>
    </ChartCard>
  )
}

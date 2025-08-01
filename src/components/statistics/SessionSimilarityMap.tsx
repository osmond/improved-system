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
import { useRunningSessions } from "@/hooks/useRunningSessions"
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
} satisfies Record<string, unknown>

export default function SessionSimilarityMap() {
  const data = useRunningSessions()

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
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  )
}

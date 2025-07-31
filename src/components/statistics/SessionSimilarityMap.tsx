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

const config = {
  cluster0: { label: "Cluster 1", color: "var(--chart-1)" },
  cluster1: { label: "Cluster 2", color: "var(--chart-2)" },
  cluster2: { label: "Cluster 3", color: "var(--chart-3)" },
} satisfies Record<string, unknown>

export default function SessionSimilarityMap() {
  const data = useRunningSessions()

  return (
    <ChartCard title="Session Similarity Map">
      <ChartContainer config={config} className="h-64">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="x" name="X" axisLine={false} tickLine={false} />
          <YAxis dataKey="y" name="Y" axisLine={false} tickLine={false} />
          <ChartTooltip />
          {data && [0, 1, 2].map((c) => (
            <Scatter
              key={c}
              data={data.filter((d) => d.cluster === c)}
              fill={`var(--chart-${c + 1})`}
            />
          ))}
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  )
}


"use client"

import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/ui/skeleton"

const colors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
]

interface SessionSimilarityMapProps {
  data: SessionPoint[] | null
}

export default function SessionSimilarityMap({
  data,
}: SessionSimilarityMapProps) {
  if (!data) return <Skeleton className="h-64" />

  const clusters = Array.from(new Set(data.map((d) => d.cluster)))
  const clusterConfig = clusters.reduce(
    (acc, c) => {
      const descriptor =
        data.find((d) => d.cluster === c)?.descriptor ?? `Cluster ${c + 1}`
      acc[c] = { label: descriptor, color: colors[c % colors.length] }
      return acc
    },
    {} as Record<number, { label: string; color: string }>,
  )
  const config = {
    ...clusterConfig,
    good: { label: "Good Day", color: "hsl(var(--chart-6))" },
  }

  return (
    <ChartCard
      title="Session Similarity"
      description="Similarity of recent runs"
    >
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="X" />
          <YAxis type="number" dataKey="y" name="Y" />
          <ChartTooltip />
          {clusters.map((c) => (
            <Scatter
              key={c}
              data={data.filter((d) => d.cluster === c)}
              fill={clusterConfig[c].color}
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
          const descriptor = clusterData[0]?.descriptor ?? ""
          return (
            <div key={c} className="flex flex-col items-center">
              <ChartContainer className="h-32 w-full" config={{}}>
                <ScatterChart>
                  <XAxis type="number" dataKey="x" hide />
                  <YAxis type="number" dataKey="y" hide />
                  <Scatter data={clusterData} fill={clusterConfig[c].color} />
                </ScatterChart>
              </ChartContainer>
              <p className="mt-2 text-xs text-center">{descriptor}</p>
              <p className="text-xs text-muted-foreground text-center">
                Avg temp {avgTemp.toFixed(1)}°F · Start {avgStart.toFixed(0)}h
              </p>
            </div>
          )
        })}
      </div>
    </ChartCard>
  )
}

"use client"

import {
  ChartContainer,
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { Cell } from "recharts"
import { useRunningStats } from "@/hooks/useRunningStats"
import { Skeleton } from "@/components/ui/skeleton"

interface ScatterPoint {
  pace: number
  hr: number
  fill: string
}

function regression(
  data: ScatterPoint[],
  xKey: keyof ScatterPoint,
  yKey: keyof ScatterPoint,
) {
  const xs = data.map((d) => d[xKey] as number)
  const ys = data.map((d) => d[yKey] as number)
  const xMean = xs.reduce((a, b) => a + b, 0) / xs.length
  const yMean = ys.reduce((a, b) => a + b, 0) / ys.length
  let num = 0
  let den = 0
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean)
    den += (xs[i] - xMean) ** 2
  }
  const slope = num / den
  const intercept = yMean - slope * xMean
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  return [
    { [xKey]: minX, [yKey]: intercept + slope * minX },
    { [xKey]: maxX, [yKey]: intercept + slope * maxX },
  ] as ScatterPoint[]
}

const config = {
  Z1: { label: "Z1", color: "hsl(var(--chart-5))" },
  Z2: { label: "Z2", color: "hsl(var(--chart-6))" },
  Z3: { label: "Z3", color: "hsl(var(--chart-7))" },
  Z4: { label: "Z4", color: "hsl(var(--chart-8))" },
  Z5: { label: "Z5", color: "hsl(var(--chart-9))" },
  trend: { label: "Trend", color: "hsl(var(--chart-3))" },
} satisfies Record<string, unknown>

export default function PaceVsHR() {
  const stats = useRunningStats()

  if (!stats) return <Skeleton className="h-64" />

  const scatterData = stats.paceVsHeart.map(({ pace, heartRate }) => {
    const zone = Math.min(5, Math.max(1, Math.floor((heartRate - 130) / 10) + 1))
    return {
      pace,
      hr: heartRate,
      fill: `hsl(var(--chart-${zone + 4}))`,
    }
  })

  const trendLine = regression(scatterData, "pace", "hr")

  const legendPayload = [1, 2, 3, 4, 5].map((z) => ({
    value: `Z${z}`,
    color: config[`Z${z}` as keyof typeof config].color as string,
  }))

  return (
    <ChartCard
      title="Pace vs Heart Rate"
      description="Correlation between pace and heart rate"
    >
      <ChartContainer config={config} className="h-64">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pace" name="Pace (min/mi)" />
          <YAxis dataKey="hr" name="Heart Rate (bpm)" />
          <ChartTooltip />
          <ChartLegend payload={legendPayload} content={<ChartLegendContent nameKey="value" />} />
          <Scatter data={scatterData} shape="circle" animationDuration={300}>
            {scatterData.map((pt, idx) => (
              <Cell key={idx} fill={pt.fill} fillOpacity={0.7} />
            ))}
          </Scatter>
          <Line data={trendLine} stroke={config.trend.color as string} dot={false} />
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  )
}

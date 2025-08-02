"use client"

import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { TooltipProps } from "recharts"
import { Polygon } from "recharts"
import ChartCard from "@/components/dashboard/ChartCard"
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/components/ui/skeleton"
import { scaleLinear } from "d3-scale"
import type { ChartConfig } from "@/components/ui/chart"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { symbol, symbolStar } from "d3-shape"
import SessionDetailDrawer from "./SessionDetailDrawer"

interface GoodDayMapProps {
  data: SessionPoint[] | null
  condition?: string | null
  hourRange?: [number, number]
}

export default function GoodDayMap({ data, condition, hourRange = [0, 23] }: GoodDayMapProps) {
  if (!data) return <Skeleton className="h-64" />

  const goodSessions = data.filter(
    (d) =>
      d.good &&
      (!condition || d.condition === condition) &&
      d.startHour >= hourRange[0] &&
      d.startHour <= hourRange[1],
  )

  if (!goodSessions.length)
    return (
      <ChartCard
        title="Good Day Sessions"
        description="Sessions exceeding expectations"
      >
        <div className="flex items-center justify-center h-64 md:h-80 lg:h-96 text-sm text-muted-foreground">
          No sessions match the selected filters.
        </div>
      </ChartCard>
    )
  const style = getComputedStyle(document.documentElement)
  const start = `hsl(${style.getPropertyValue("--chart-4")})`
  const end = `hsl(${style.getPropertyValue("--chart-6")})`
  const config = {
    small: { label: "Smaller Δ", color: start },
    large: { label: "Larger Δ", color: end },
  } satisfies ChartConfig

  const minDelta = Math.min(...goodSessions.map((d) => d.paceDelta))
  const maxDelta = Math.max(...goodSessions.map((d) => d.paceDelta))
  const colorScale = scaleLinear<string>().domain([minDelta, maxDelta]).range([start, end])
  const colored = goodSessions.map((s) => ({ ...s, fill: colorScale(s.paceDelta) }))
  const [active, setActive] = useState<SessionPoint | null>(null)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [condition, hourRange])

  const clusters = Array.from(new Set(colored.map((d) => d.cluster)))

  function convexHull(points: { x: number; y: number }[]) {
    if (points.length < 3) return points
    const pts = points
      .slice()
      .sort((a, b) => (a.x - b.x === 0 ? a.y - b.y : a.x - b.x))
    const cross = (o: { x: number; y: number }, a: { x: number; y: number }, b: {
      x: number
      y: number
    }) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x)
    const lower: { x: number; y: number }[] = []
    for (const p of pts) {
      while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0)
        lower.pop()
      lower.push(p)
    }
    const upper: { x: number; y: number }[] = []
    for (let i = pts.length - 1; i >= 0; i--) {
      const p = pts[i]
      while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0)
        upper.pop()
      upper.push(p)
    }
    upper.pop()
    lower.pop()
    return lower.concat(upper)
  }

  const hulls = clusters
    .map((c) => ({
      cluster: c,
      hull: convexHull(colored.filter((d) => d.cluster === c).map((d) => ({ x: d.x, y: d.y }))),
    }))
    .filter((h) => h.hull.length >= 3)

  const clusterColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ]

  const star = symbol().type(symbolStar).size(80)

  const AnimatedStar = ({ cx, cy, fill }: { cx?: number; cy?: number; fill?: string }) => (
    <motion.g
      transform={`translate(${cx}, ${cy})`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <path d={star()} fill={fill} />
    </motion.g>
  )

  return (
    <ChartCard
      title="Good Day Sessions"
      description="Sessions exceeding expectations"
    >
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="X" />
          <YAxis type="number" dataKey="y" name="Y" />
          <ChartTooltip content={<GoodDayTooltip />} />
          <ChartLegend
            payload={[
              { value: "small", type: "square", color: start, dataKey: "small" },
              { value: "large", type: "square", color: end, dataKey: "large" },
            ]}
            content={<ChartLegendContent />}
          />
          {hulls.map(({ cluster, hull }) => (
            <Polygon
              key={cluster}
              points={hull}
              fill={clusterColors[cluster % clusterColors.length]}
              fillOpacity={0.1}
              stroke={clusterColors[cluster % clusterColors.length]}
              strokeOpacity={0.4}
            />
          ))}
          <Scatter
            key={animKey}
            data={colored}
            shape={AnimatedStar}
            isAnimationActive={false}
            onClick={(data) => setActive(data as SessionPoint)}
            cursor="pointer"
          />
        </ScatterChart>
      </ChartContainer>
      <SessionDetailDrawer session={active} onClose={() => setActive(null)} />
    </ChartCard>
  )
}

function GoodDayTooltip(props: TooltipProps<number, string>) {
  const { active, payload } = props
  if (!(active && payload && payload.length)) return null

  const session = payload[0].payload as SessionPoint
  return (
    <ChartTooltipContent
      active={active}
      payload={payload}
      hideLabel
      hideIndicator
      formatter={() => (
        <div className="grid gap-1">
          <span>Pace: {session.pace.toFixed(2)} min/mi</span>
          <span>Δ Pace: {session.paceDelta.toFixed(2)} min/mi</span>
          <span>Heart Rate: {session.heartRate} bpm</span>
          <span>Temp: {session.temperature}°F</span>
          <span>Humidity: {session.humidity}%</span>
          <span>Wind: {session.wind} mph</span>
        </div>
      )}
    />
  )
}


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
} from "@/ui/chart"
import type { TooltipProps } from "recharts"
import { Polygon, ReferenceDot } from "recharts"
import ChartCard from "@/components/dashboard/ChartCard"
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/ui/skeleton"
import { Button } from "@/ui/button"
import { scaleLinear } from "d3-scale"
import type { ChartConfig } from "@/ui/chart"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { symbol, symbolStar } from "d3-shape"
import SessionDetailDrawer from "./SessionDetailDrawer"
import PaceDeltaHistogram from "./PaceDeltaHistogram"

interface GoodDayMapProps {
  data: SessionPoint[] | null
  condition?: string | null
  hourRange?: [number, number]
  onSelect?: (s: SessionPoint) => void
}

export default function GoodDayMap({ data, condition, hourRange = [0, 23], onSelect }: GoodDayMapProps) {
  const [sampleData, setSampleData] = useState<SessionPoint[] | null>(null)
  const [hoverRange, setHoverRange] = useState<[number, number] | null>(null)
  const [active, setActive] = useState<SessionPoint | null>(null)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    setAnimKey((k) => k + 1)
  }, [condition, hourRange, sampleData])

  if (!data && !sampleData) return <Skeleton className="h-64" />

  const sessions = sampleData ?? data ?? []

  const goodSessions = sessions.filter(
    (d) =>
      d.good &&
      (!condition || d.condition === condition) &&
      d.startHour >= hourRange[0] &&
      d.startHour <= hourRange[1],
  )

  if (!goodSessions.length) {
    const sampleSessions: SessionPoint[] = [
      {
        id: 1,
        x: 1,
        y: 2,
        cluster: 0,
        good: true,
        pace: 7.5,
        paceDelta: 0.3,
        heartRate: 140,
        confidence: 0.9,
        temperature: 65,
        humidity: 40,
        wind: 5,
        startHour: 8,
        duration: 30,
        lat: 0,
        lon: 0,
        condition: "Sunny",
        start: new Date().toISOString(),
        tags: [],
        isFalsePositive: false,
      },
      {
        id: 2,
        x: 2,
        y: 1.5,
        cluster: 1,
        good: true,
        pace: 8,
        paceDelta: 0.6,
        heartRate: 150,
        confidence: 0.7,
        temperature: 70,
        humidity: 50,
        wind: 6,
        startHour: 9,
        duration: 40,
        lat: 0,
        lon: 0,
        condition: "Cloudy",
        start: new Date().toISOString(),
        tags: [],
        isFalsePositive: false,
      },
    ]
    return (
      <ChartCard
        title="Good Day Sessions"
        description="Sessions exceeding expectations"
      >
        <div className="flex flex-col items-center justify-center gap-4 h-64 md:h-80 lg:h-96 text-sm text-muted-foreground text-center">
          <p>No sessions match the selected filters.</p>
          <p>Record runs to build up history or load sample data to explore this chart.</p>
          <Button size="sm" onClick={() => setSampleData(sampleSessions)}>
            Load sample data
          </Button>
        </div>
      </ChartCard>
    )
  }
  const benchmarkPercent = 0.1
  const sortedByDelta = [...goodSessions].sort((a, b) => b.paceDelta - a.paceDelta)
  const benchmarkCount = Math.max(1, Math.floor(sortedByDelta.length * benchmarkPercent))
  const benchmarkSet = new Set(sortedByDelta.slice(0, benchmarkCount).map((s) => s.id))

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
  const colored = goodSessions.map((s) => ({
    ...s,
    fill: colorScale(s.paceDelta),
    opacity: hoverRange
      ? s.paceDelta >= hoverRange[0] && s.paceDelta < hoverRange[1]
        ? 1
        : 0.2
      : 1,
    benchmark: benchmarkSet.has(s.id),
  }))

  let bins: { start: number; end: number; count: number; color: string }[] = []
  if (minDelta === maxDelta) {
    bins = [
      { start: minDelta, end: maxDelta, count: goodSessions.length, color: colorScale(minDelta) },
    ]
  } else {
    const binCount = 5
    const binSize = (maxDelta - minDelta) / binCount
    bins = Array.from({ length: binCount }, (_, i) => {
      const startBin = minDelta + i * binSize
      const endBin = i === binCount - 1 ? maxDelta + 0.0001 : startBin + binSize
      return {
        start: startBin,
        end: endBin,
        count: goodSessions.filter(
          (s) => s.paceDelta >= startBin && s.paceDelta < endBin,
        ).length,
        color: colorScale(startBin + binSize / 2),
      }
    })
  }

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

  function polygonCentroid(points: { x: number; y: number }[]) {
    let area = 0
    let cx = 0
    let cy = 0
    const n = points.length
    for (let i = 0; i < n; i++) {
      const p0 = points[i]
      const p1 = points[(i + 1) % n]
      const f = p0.x * p1.y - p1.x * p0.y
      area += f
      cx += (p0.x + p1.x) * f
      cy += (p0.y + p1.y) * f
    }
    area *= 0.5
    if (area === 0) return { x: 0, y: 0 }
    return { x: cx / (6 * area), y: cy / (6 * area) }
  }

  const clusterStats = clusters
    .map((c) => {
      const clusterSessions = colored.filter((d) => d.cluster === c)
      const hull = convexHull(clusterSessions.map((d) => ({ x: d.x, y: d.y })))
      if (hull.length < 3) return null
      const meanDelta =
        clusterSessions.reduce((sum, s) => sum + s.paceDelta, 0) /
        clusterSessions.length
      const count = clusterSessions.length
      const conditionCounts = clusterSessions.reduce(
        (acc, s) => {
          acc[s.condition] = (acc[s.condition] || 0) + 1
          return acc
        },
        {} as Record<string, number>,
      )
      const conditionLabel = Object.keys(conditionCounts).reduce((a, b) =>
        conditionCounts[a] > conditionCounts[b] ? a : b,
      )
      const avgHour =
        clusterSessions.reduce((sum, s) => sum + s.startHour, 0) / count
      const timeLabel =
        avgHour < 12 ? "Mornings" : avgHour < 18 ? "Afternoons" : "Evenings"
      const centroid = polygonCentroid(hull)
      return {
        cluster: c,
        hull,
        centroid,
        meanDelta,
        count,
        conditionLabel,
        timeLabel,
      }
    })
    .filter(Boolean) as {
    cluster: number
    hull: { x: number; y: number }[]
    centroid: { x: number; y: number }
    meanDelta: number
    count: number
    conditionLabel: string
    timeLabel: string
  }[]

  const clusterColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ]

  const star = symbol().type(symbolStar).size(80)

  const AnimatedStar = (
    {
      cx,
      cy,
      fill,
      payload,
      onClick,
      ...rest
    }: {
      cx?: number
      cy?: number
      fill?: string
      payload?: SessionPoint & { benchmark?: boolean }
      onClick?: (data: SessionPoint) => void
    },
  ) => (
    <motion.g
      transform={`translate(${cx}, ${cy})`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: (payload as any)?.opacity ?? 1 }}
      transition={{ duration: 0.5 }}
      role="button"
      tabIndex={0}
      aria-label={`Session with pace ${payload ? payload.pace.toFixed(2) : ''} min/mi`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick?.(payload as SessionPoint)
        }
      }}
      onClick={() => onClick?.(payload as SessionPoint)}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
      {...rest}
    >
      <circle
        r={8}
        fill="none"
        stroke={fill}
        strokeOpacity={(payload as any)?.confidence ?? 0}
        strokeWidth={3}
      />
      <path
        d={star()}
        fill={(payload as any)?.benchmark ? fill : 'none'}
        stroke={fill}
        strokeWidth={1}
      />
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
          {clusterStats.map(({ cluster, hull }) => (
            <Polygon
              key={cluster}
              points={hull}
              fill={clusterColors[cluster % clusterColors.length]}
              fillOpacity={0.1}
              stroke={clusterColors[cluster % clusterColors.length]}
              strokeOpacity={0.4}
            />
          ))}
          {clusterStats.map(
            ({ cluster, centroid, meanDelta, count, conditionLabel, timeLabel }) => (
              <ReferenceDot
                key={`label-${cluster}`}
                x={centroid.x}
                y={centroid.y}
                r={0}
                isFront
                label={{
                  value: `${conditionLabel} ${timeLabel}: avg Δ ${meanDelta.toFixed(1)} min/mi, ${count} sessions`,
                  position: "top",
                  fontSize: 12,
                  fill: "currentColor",
                }}
              />
            ),
          )}
          <Scatter
            key={animKey}
            data={colored}
            shape={AnimatedStar}
            isAnimationActive={false}
            onClick={(data) => (onSelect ? onSelect(data as SessionPoint) : setActive(data as SessionPoint))}
            cursor="pointer"
          />
        </ScatterChart>
      </ChartContainer>
      <PaceDeltaHistogram bins={bins} onHover={setHoverRange} />
      {!onSelect && <SessionDetailDrawer session={active} onClose={() => setActive(null)} />}
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
          <span>Confidence: {(session.confidence * 100).toFixed(0)}%</span>
          <span>Temp: {session.temperature}°F</span>
          <span>Humidity: {session.humidity}%</span>
          <span>Wind: {session.wind} mph</span>
        </div>
      )}
    />
  )
}


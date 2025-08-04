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
import { ReferenceDot, Customized } from "recharts"
import ChartCard from "@/components/dashboard/ChartCard"
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/ui/skeleton"
import { Slider } from "@/ui/slider"
import { scaleLinear } from "d3-scale"
import type { ChartConfig } from "@/ui/chart"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { symbol, symbolStar } from "d3-shape"
import SessionDetailDrawer from "@/components/analytical/SessionDetailDrawer"
import PaceDeltaHistogram from "./PaceDeltaHistogram"

interface GoodDayMapProps {
  data: SessionPoint[] | null
  condition?: string | null
  hourRange?: [number, number]
  onSelect?: (s: SessionPoint) => void
  dateRange?: [string, string] | null
}
export default function GoodDayMap({
  data,
  condition,
  hourRange = [0, 23],
  onSelect,
  dateRange,
}: GoodDayMapProps) {
  const [requiredImprovement, setRequiredImprovement] = useState(0.5)
  const [hoverRange, setHoverRange] = useState<[number, number] | null>(null)
  const [active, setActive] = useState<SessionPoint | null>(null)

  if (!data) return <Skeleton className="h-64" />

  const sessions = data ?? []

  const inDateRange = (s: SessionPoint) => {
    if (!dateRange) return true
    const d = s.start.slice(0, 10)
    return d >= dateRange[0] && d <= dateRange[1]
  }

  const goodSessions = sessions.filter(
    (d) =>
      d.good &&
      (!condition || d.condition === condition) &&
      d.startHour >= hourRange[0] &&
      d.startHour <= hourRange[1] &&
      inDateRange(d),
  )

  if (!goodSessions.length) {
    const goodData = (data ?? []).filter((s) => s.good)
    const suggestions: string[] = []
    if (goodData.length) {
      if (condition && !goodData.some((s) => s.condition === condition)) {
        const conditions = Array.from(new Set(goodData.map((s) => s.condition)))
        suggestions.push(`Condition: ${conditions.join(", ")}`)
      }
      const minHour = Math.min(...goodData.map((s) => s.startHour))
      const maxHour = Math.max(...goodData.map((s) => s.startHour))
      if (hourRange[0] > minHour || hourRange[1] < maxHour) {
        suggestions.push(`Hours: ${minHour}–${maxHour}`)
      }
      if (dateRange) {
        const dates = goodData.map((s) => s.start.slice(0, 10))
        const minDate = dates.reduce((a, b) => (a < b ? a : b))
        const maxDate = dates.reduce((a, b) => (a > b ? a : b))
        if (dateRange[0] > minDate || dateRange[1] < maxDate) {
          suggestions.push(`Dates: ${minDate} to ${maxDate}`)
        }
      }
    }
    const star = symbol().type(symbolStar).size(80)()
    return (
      <ChartCard
        title="Good Day Sessions"
        description="Sessions exceeding expectations"
      >
        <div className="flex flex-col items-center justify-center gap-4 h-64 md:h-80 lg:h-96 text-sm text-muted-foreground text-center">
          <p>No sessions match the selected filters.</p>
          <div className="flex flex-col items-center gap-2">
            <p className="font-medium">Prototypical good day</p>
            <svg width="48" height="48" viewBox="-24 -24 48 48">
              <path d={star} fill="hsl(var(--chart-4))" stroke="hsl(var(--chart-4))" />
            </svg>
            <p className="text-xs">Pace: 7:30 min/mi</p>
            <p className="text-xs">Δ Pace: {requiredImprovement.toFixed(1)} min/mi</p>
          </div>
          <div className="w-full max-w-xs">
            <Slider
              min={0}
              max={1.5}
              step={0.1}
              value={[requiredImprovement]}
              onValueChange={(v) => setRequiredImprovement(v[0])}
            />
            <p className="text-xs mt-2">
              What if you improved by {requiredImprovement.toFixed(1)} min/mi?
            </p>
          </div>
          {suggestions.length > 0 && (
            <div className="text-xs">
              <p>Suggested filters:</p>
              <ul className="list-disc pl-4 text-left">
                {suggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ChartCard>
    )
  }
  const benchmarkPercent = 0.1
  const sortedByDelta = [...goodSessions].sort((a, b) => b.paceDelta - a.paceDelta)
  const benchmarkCount = Math.max(1, Math.floor(sortedByDelta.length * benchmarkPercent))
  const benchmarkSet = new Set(sortedByDelta.slice(0, benchmarkCount).map((s) => s.id))

  const [colors, setColors] = useState({
    start: "hsl(222 70% 60%)",
    end: "hsl(230 70% 50%)",
  })

  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = getComputedStyle(document.documentElement)
      setColors({
        start: `hsl(${style.getPropertyValue("--chart-4")})`,
        end: `hsl(${style.getPropertyValue("--chart-6")})`,
      })
    }
  }, [])

  const { start, end } = colors
  const config = {} satisfies ChartConfig

  const minDelta = Math.min(...goodSessions.map((d) => d.paceDelta))
  const maxDelta = Math.max(...goodSessions.map((d) => d.paceDelta))
  const colorScale = scaleLinear<string>().domain([minDelta, maxDelta]).range([start, end])
  const sizeScale = scaleLinear<number>().domain([minDelta, maxDelta]).range([40, 160])
  const highlightThreshold = 1
  const colored = goodSessions.map((s) => {
    const isHighlight = s.paceDelta >= highlightThreshold
    return {
      ...s,
      fill: colorScale(s.paceDelta),
      pointSize: sizeScale(s.paceDelta),
      opacity: isHighlight
        ? 1
        : hoverRange
          ? s.paceDelta >= hoverRange[0] && s.paceDelta < hoverRange[1]
            ? 1
            : 0.2
          : 1,
      benchmark: benchmarkSet.has(s.id),
      highlight: isHighlight,
    }
  })

  const topSessions = [...colored].sort((a, b) => b.paceDelta - a.paceDelta).slice(0, 3)

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
      const descriptor =
        clusterSessions[0]?.descriptor ?? `Cluster ${c + 1}`
      const centroid = polygonCentroid(hull)
      return {
        cluster: c,
        hull,
        centroid,
        meanDelta,
        count,
        descriptor,
      }
    })
    .filter(Boolean) as {
    cluster: number
    hull: { x: number; y: number }[]
    centroid: { x: number; y: number }
    meanDelta: number
    count: number
    descriptor: string
  }[]

  const clusterColors = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
  ]

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
      payload?: SessionPoint & {
        benchmark?: boolean
        pointSize?: number
        highlight?: boolean
      }
      onClick?: (data: SessionPoint) => void
    },
  ) => {
    const size = (payload as any)?.pointSize ?? 80
    const starPath = symbol().type(symbolStar).size(size)()
    const haloRadius = Math.sqrt(size)
    const haloWidth = 1 + 4 * ((payload as any)?.confidence ?? 0)
    const isHighlight = (payload as any)?.highlight
    return (
      <motion.g
        key={(payload as any)?.id}
        transform={`translate(${cx}, ${cy})`}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isHighlight
            ? { scale: [1, 1.2, 1], opacity: (payload as any)?.opacity ?? 1 }
            : { scale: 1, opacity: (payload as any)?.opacity ?? 1 }
        }
        exit={{ scale: 0, opacity: 0 }}
        transition={
          isHighlight
            ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
        whileHover={{
          scale: 1.1,
          filter: "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))",
        }}
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
          r={haloRadius}
          fill="none"
          stroke={fill}
          strokeOpacity={0.6}
          strokeWidth={haloWidth}
        />
        <path
          d={starPath}
          fill={(payload as any)?.benchmark ? fill : 'none'}
          stroke={fill}
          strokeWidth={1}
        />
      </motion.g>
    )
  }

  const DeltaLegend = () => {
    const smallStar = symbol().type(symbolStar).size(40)()
    const largeStar = symbol().type(symbolStar).size(160)()
    const sampleStar = symbol().type(symbolStar).size(80)()
    return (
      <div className="flex flex-col items-center gap-2">
        <ChartLegendContent
          variant="gradient"
          min={
            <div className="flex items-center gap-1">
              <svg width="16" height="16" viewBox="-8 -8 16 16">
                <path d={smallStar} fill={start} stroke={start} />
              </svg>
              <span>Smaller Δ</span>
            </div>
          }
          max={
            <div className="flex items-center gap-1">
              <svg width="24" height="24" viewBox="-12 -12 24 24">
                <path d={largeStar} fill={end} stroke={end} />
              </svg>
              <span>Larger Δ</span>
            </div>
          }
          gradient={`linear-gradient(to right, ${start}, ${end})`}
        />
        <div className="flex items-center gap-1 text-muted-foreground">
          <svg width="24" height="24" viewBox="-12 -12 24 24">
            <circle cx="0" cy="0" r="8" fill="none" stroke="currentColor" strokeWidth="4" />
            <path d={sampleStar} fill="currentColor" />
          </svg>
          <span>Halo thickness = confidence</span>
        </div>
      </div>
    )
  }

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
          <ChartLegend content={<DeltaLegend />} />
          <AnimatePresence>
            {clusterStats.map(({ cluster, hull }) => {
              const hullPath = `M${hull.map((p) => `${p.x},${p.y}`).join("L")}Z`
              const color = clusterColors[cluster % clusterColors.length]
              return (
                <motion.path
                  key={cluster}
                  d={hullPath}
                  fill={color}
                  stroke={color}
                  fillOpacity={0.1}
                  strokeOpacity={0.4}
                  initial={{ opacity: 0, d: hullPath }}
                  animate={{ opacity: 1, d: hullPath }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )
            })}
          </AnimatePresence>
          {clusterStats.map(
            ({ cluster, centroid, meanDelta, count, descriptor }) => (
              <ReferenceDot
                key={`label-${cluster}`}
                x={centroid.x}
                y={centroid.y}
                r={0}
                isFront
                label={{
                  value: `${descriptor}: avg Δ ${meanDelta.toFixed(1)} min/mi, ${count} sessions`,
                  position: "top",
                  fontSize: 12,
                  fill: "currentColor",
                }}
              />
            ),
          )}
          {topSessions.map((s, i) => (
            <ReferenceDot
              key={`top-${s.id}`}
              x={s.x}
              y={s.y}
              r={0}
              isFront
              label={{
                value: `Top ${i + 1}: Δ ${s.paceDelta.toFixed(1)}`,
                position: "top",
                fontSize: 12,
                fill: "currentColor",
              }}
            />
          ))}
          <Scatter data={colored} shape={() => null} isAnimationActive={false} />
          <Customized
            component={({ xAxisMap, yAxisMap, offset }: any) => {
              const xKey = Object.keys(xAxisMap)[0]
              const yKey = Object.keys(yAxisMap)[0]
              const xScale = xAxisMap[xKey].scale
              const yScale = yAxisMap[yKey].scale
              return (
                <AnimatePresence>
                  {colored.map((s) => (
                    <AnimatedStar
                      key={s.id}
                      cx={xScale(s.x) + offset.left}
                      cy={yScale(s.y) + offset.top}
                      fill={s.fill}
                      payload={s}
                      onClick={(d) =>
                        onSelect ? onSelect(d) : setActive(d as SessionPoint)
                      }
                    />
                  ))}
                </AnimatePresence>
              )
            }}
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
          <span>{session.descriptor}</span>
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


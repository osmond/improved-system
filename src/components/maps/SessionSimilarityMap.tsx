"use client"

import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  Brush,
} from "@/ui/chart"
import type { ChartConfig } from "@/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { SessionPoint } from "@/hooks/useRunningSessions"
import { Skeleton } from "@/ui/skeleton"
import { polygonHull, polygonCentroid } from "d3-polygon"
import { contourDensity } from "d3-contour"
import { geoPath } from "d3-geo"
import { Customized, Polygon } from "recharts"
import ClusterCard from "./ClusterCard"
import RunComparisonPanel from "./RunComparisonPanel"
import { Button } from "@/components/ui/button"
import Slider from "@/ui/slider"
import { useState, useEffect, useMemo } from "react"
import type { TooltipProps } from "recharts"
import { computeClusterStability } from "@/lib/clusterStability"

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

  const sorted = useMemo(
    () =>
      data
        .slice()
        .sort(
          (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
        ),
    [data],
  )
  const [playIndex, setPlayIndex] = useState(sorted.length - 1)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlayIndex(sorted.length - 1)
  }, [sorted.length])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      setPlayIndex((i) => {
        if (i >= sorted.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, 500)
    return () => clearInterval(id)
  }, [playing, sorted.length])

  const timelineData = sorted.slice(0, playIndex + 1)
  const stability = useMemo(() => computeClusterStability(data), [data])

  const getTag = (prefix: string, s: SessionPoint) =>
    s.tags.find((t) => t.startsWith(prefix))?.slice(prefix.length) || null

  const weatherOptions = Array.from(new Set(data.map((d) => d.condition)))
  const routeOptions = Array.from(
    new Set(
      data
        .map((d) => getTag("route:", d))
        .filter((v): v is string => Boolean(v)),
    ),
  )
  const recoveryOptions = Array.from(
    new Set(
      data
        .map((d) => getTag("recovery:", d))
        .filter((v): v is string => Boolean(v)),
    ),
  )

  const getTimeOfDay = (h: number) =>
    h < 6 ? "Early" : h < 12 ? "Morning" : h < 18 ? "Afternoon" : "Evening"
  const timeOptions = ["Early", "Morning", "Afternoon", "Evening"]

  const [weather, setWeather] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [route, setRoute] = useState<string | null>(null)
  const [recovery, setRecovery] = useState<string | null>(null)

  const [selected, setSelected] = useState<SessionPoint | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const handlePointSelect = (s: SessionPoint) => {
    setSelected(s)
    setPanelOpen(true)
  }

  const filtered = timelineData.filter((s) => {
    if (weather && s.condition !== weather) return false
    if (time && getTimeOfDay(s.startHour) !== time) return false
    if (route && getTag("route:", s) !== route) return false
    if (recovery && getTag("recovery:", s) !== recovery) return false
    return true
  })

  const clusters = Array.from(new Set(filtered.map((d) => d.cluster)))
  const clusterConfig = clusters.reduce(
    (acc, c) => {
      const descriptor =
        filtered.find((d) => d.cluster === c)?.descriptor ?? `Cluster ${c + 1}`
      acc[c] = { label: descriptor, color: colors[c % colors.length] }
      return acc
    },
    {} as Record<string, { label: string; color: string }>,
  )
  const clusterDetails = clusters.map((c) => {
    const points = filtered.filter((d) => d.cluster === c)
    const hull = polygonHull(points.map((p) => [p.x, p.y]))
    const centroid = hull
      ? polygonCentroid(hull)
      : [
          points.reduce((sum, p) => sum + p.x, 0) / points.length,
          points.reduce((sum, p) => sum + p.y, 0) / points.length,
        ]
    const avgTemp = points.reduce((s, p) => s + p.temperature, 0) / points.length
    const avgHour = points.reduce((s, p) => s + p.startHour, 0) / points.length
    const avgDelta = points.reduce((s, p) => s + p.paceDelta, 0) / points.length
    return {
      cluster: c,
      points,
      hull,
      centroid,
      stability: stability[c] ?? 0,
      centroidVec: { temperature: avgTemp, startHour: avgHour, paceDelta: avgDelta },
    }
  })
  const [activeCluster, setActiveCluster] = useState<number | null>(null)
  const goodRuns = filtered.filter(
    (d) => d.good && (activeCluster === null || d.cluster === activeCluster),
  )
  const paceThreshold = percentile(goodRuns.map((d) => d.paceDelta), 0.9)
  const config: ChartConfig = {
    ...clusterConfig,
    good: {
      label: "Good Day",
      color: "hsl(var(--chart-6))",
      icon: GoodRunLegendIcon,
    },
    pace: { label: "Size = Pace Δ", icon: SizeLegendIcon },
    confidence: { label: "Halo = Confidence", icon: HaloLegendIcon },
  }

  const legendPayload = Object.entries(config).map(([key, item]) => ({
    dataKey: key,
    value: key,
    color: item.color,
  }))

  return (
    <ChartCard
      title="Session Similarity"
      description="Similarity of recent runs"
    >
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? "Pause" : "Play"}
          </Button>
          <Slider
            min={0}
            max={sorted.length - 1}
            step={1}
            value={[playIndex]}
            onValueChange={(v) => {
              setPlayIndex(v[0])
              setPlaying(false)
            }}
            className="w-64"
          />
          <span className="text-xs text-muted-foreground">
            {new Date(sorted[playIndex].start).toLocaleDateString()}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Weather:</span>
          <Button
            size="sm"
            variant={weather === null ? "default" : "outline"}
            onClick={() => setWeather(null)}
          >
            All
          </Button>
          {weatherOptions.map((w) => (
            <Button
              key={w}
              size="sm"
              variant={weather === w ? "default" : "outline"}
              onClick={() => setWeather(w)}
            >
              {w}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Time:</span>
          <Button
            size="sm"
            variant={time === null ? "default" : "outline"}
            onClick={() => setTime(null)}
          >
            All
          </Button>
          {timeOptions.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={time === t ? "default" : "outline"}
              onClick={() => setTime(t)}
            >
              {t}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Route:</span>
          <Button
            size="sm"
            variant={route === null ? "default" : "outline"}
            onClick={() => setRoute(null)}
          >
            All
          </Button>
          {routeOptions.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={route === r ? "default" : "outline"}
              onClick={() => setRoute(r)}
            >
              {r}
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Recovery:</span>
          <Button
            size="sm"
            variant={recovery === null ? "default" : "outline"}
            onClick={() => setRecovery(null)}
          >
            All
          </Button>
          {recoveryOptions.map((r) => (
            <Button
              key={r}
              size="sm"
              variant={recovery === r ? "default" : "outline"}
              onClick={() => setRecovery(r)}
            >
              {r}
            </Button>
          ))}
        </div>
      </div>
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" dataKey="x" name="X" />
          <YAxis type="number" dataKey="y" name="Y" />
          <Brush dataKey="x" height={20} travellerWidth={10} />
          <ChartTooltip content={<SessionTooltip />} />
          <Customized
            component={
              <ClusterBackground
                clusters={clusterDetails}
                clusterConfig={clusterConfig}
                activeCluster={activeCluster}
              />
            }
          />
          {clusters.map((c) => (
            <Scatter
              key={c}
              data={filtered.filter((d) => d.cluster === c)}
              fill={clusterConfig[c].color}
              animationDuration={300}
              opacity={activeCluster === null || activeCluster === c ? 1 : 0.2}
              shape={(props) => (
                <RunSymbol {...props} onSelect={handlePointSelect} />
              )}
            />
          ))}
          <Customized
            component={
              <DeviationTrails
                points={goodRuns}
                clusters={clusterDetails}
                activeCluster={activeCluster}
              />
            }
          />
          <Scatter
            data={goodRuns}
            fill="hsl(var(--chart-6))"
            shape={(props) => (
              <GoodRunSymbol
                {...props}
                paceThreshold={paceThreshold}
                onSelect={handlePointSelect}
              />
            )}
          />
          <Customized
            component={
              <ClusterCentroids
                clusters={clusterDetails}
                clusterConfig={clusterConfig}
                activeCluster={activeCluster}
              />
            }
          />
          <ChartLegend
            content={<ChartLegendContent payload={legendPayload} />}
            onClick={(item) => {
              const c = Number(item.dataKey)
              if (!Number.isNaN(c)) {
                setActiveCluster((prev) => (prev === c ? null : c))
              }
            }}
          />
        </ScatterChart>
      </ChartContainer>
      <p className="mt-2 text-xs text-muted-foreground">
        Points close together represent runs with similar pace, heart rate,
        weather, and time.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clusters.map((c) => {
          const clusterData = filtered.filter((d) => d.cluster === c)
          return (
            <div
              key={c}
              className={
                activeCluster === null || activeCluster === c
                  ? ""
                  : "opacity-50"
              }
            >
              <ClusterCard
                data={clusterData}
                color={clusterConfig[c].color}
                stability={
                  clusterDetails.find((d) => d.cluster === c)?.stability || 0
                }
                label={clusterConfig[c].label}
                centroid={
                  clusterDetails.find((d) => d.cluster === c)?.centroidVec
                }
                open={activeCluster === c}
                onOpenChange={(o) => setActiveCluster(o ? c : null)}
                onSelect={() => setActiveCluster(c)}
              />
            </div>
          )
        })}
      </div>
      <RunComparisonPanel
        open={panelOpen}
        onOpenChange={setPanelOpen}
        session={selected}
        clusterPoints={
          selected
            ? clusterDetails.find((d) => d.cluster === selected.cluster)?.points || []
            : []
        }
        allSessions={filtered}
      />
    </ChartCard>
  )
}

function ClusterBackground({
  clusters,
  clusterConfig,
  width,
  height,
  offset,
  xAxisMap,
  yAxisMap,
  activeCluster,
}: any) {
  const xAxis = Object.values(xAxisMap)[0]
  const yAxis = Object.values(yAxisMap)[0]
  const xScale = xAxis.scale
  const yScale = yAxis.scale
  const path = geoPath()

  return (
    <g>
      {clusters.map((cluster: any) => {
        const color = clusterConfig[cluster.cluster].color
        const dimmed =
          activeCluster !== null && activeCluster !== cluster.cluster
        const density = contourDensity()
          .x((d: any) => xScale(d.x) + offset.left)
          .y((d: any) => yScale(d.y) + offset.top)
          .size([width, height])
          .bandwidth(20)(cluster.points)

        const hullPoints = cluster.hull?.map(([x, y]: number[]) => ({
          x: xScale(x) + offset.left,
          y: yScale(y) + offset.top,
        }))

        return (
          <g key={cluster.cluster}>
            {density.map((contour: any, i: number) => (
              <path
                key={`density-${cluster.cluster}-${i}`}
                d={path(contour) ?? undefined}
                fill={color}
                fillOpacity={dimmed ? 0.02 : 0.05}
                stroke="none"
              />
            ))}
            {hullPoints && (
              <Polygon
                points={hullPoints}
                stroke={color}
                fill={color}
                fillOpacity={dimmed ? 0.05 : 0.1}
              />
            )}
          </g>
        )
      })}
    </g>
  )
}

function ClusterCentroids({
  clusters,
  clusterConfig,
  offset,
  xAxisMap,
  yAxisMap,
  activeCluster,
}: any) {
  const xAxis = Object.values(xAxisMap)[0]
  const yAxis = Object.values(yAxisMap)[0]
  const xScale = xAxis.scale
  const yScale = yAxis.scale

  return (
    <g>
      {clusters.map((cluster: any) => {
        const color = clusterConfig[cluster.cluster].color
        const [cx, cy] = cluster.centroid
        const x = xScale(cx) + offset.left
        const y = yScale(cy) + offset.top
        const dimmed =
          activeCluster !== null && activeCluster !== cluster.cluster

        return (
          <g key={`centroid-${cluster.cluster}`} opacity={dimmed ? 0.3 : 1}>
            <circle
              cx={x}
              cy={y}
              r={4}
              fill={color}
              stroke="#fff"
              strokeWidth={1}
            />
            <text x={x + 6} y={y - 6} fill={color} fontSize={10}>
              {clusterConfig[cluster.cluster].label}
            </text>
          </g>
        )
      })}
    </g>
  )
}

function DeviationTrails({
  points,
  clusters,
  offset,
  xAxisMap,
  yAxisMap,
  activeCluster,
}: any) {
  const xAxis = Object.values(xAxisMap)[0]
  const yAxis = Object.values(yAxisMap)[0]
  const xScale = xAxis.scale
  const yScale = yAxis.scale

  return (
    <g>
      {points
        .filter((p: any) => activeCluster === null || p.cluster === activeCluster)
        .map((p: any) => {
          const cluster = clusters.find((c: any) => c.cluster === p.cluster)
          if (!cluster) return null
          const [cx, cy] = cluster.centroid
          const x1 = xScale(cx) + offset.left
          const y1 = yScale(cy) + offset.top
          const x2 = xScale(p.x) + offset.left
          const y2 = yScale(p.y) + offset.top
          return (
            <line
              key={`trail-${p.id}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="hsl(var(--chart-6))"
              strokeOpacity={0.2}
              strokeWidth={1}
            />
          )
        })}
    </g>
  )
}

function RunSymbol({ cx, cy, payload, fill, onSelect }: any) {
  const size = 6 + Math.max(0, payload.paceDelta) * 3
  const halo = size + payload.confidence * 10

  return (
    <g>
      <circle cx={cx} cy={cy} r={halo} fill={fill} opacity={0.2} />
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={fill}
        stroke="#fff"
        strokeWidth={1}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(payload)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelect(payload)
          }
        }}
      />
    </g>
  )
}

function GoodRunSymbol({ cx, cy, payload, paceThreshold, onSelect, fill }: any) {
  const size = 6 + Math.max(0, payload.paceDelta) * 3
  const conf = payload.confidence ?? 0
  const halo = size + 2

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={halo}
        fill="none"
        stroke={fill}
        strokeOpacity={conf}
        strokeWidth={2}
      />
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill={fill}
        stroke="#fff"
        strokeWidth={1}
        role="button"
        tabIndex={0}
        onClick={() => onSelect(payload)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            onSelect(payload)
          }
        }}
      />
      {payload.paceDelta >= paceThreshold && (
        <text x={cx} y={cy - size - 2} textAnchor="middle" fontSize={10}>
          ✨
        </text>
      )}
    </g>
  )
}

function GoodRunLegendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <text x="8" y="3" textAnchor="middle" fontSize="8">
        ✨
      </text>
      <circle
        cx="8"
        cy="8"
        r="5"
        fill="hsl(var(--chart-6))"
        stroke="#fff"
        strokeWidth="1"
      />
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="none"
        stroke="hsl(var(--chart-6))"
        strokeWidth="2"
      />
    </svg>
  )
}

function SizeLegendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="text-muted-foreground">
      <circle cx="5" cy="8" r="3" fill="currentColor" opacity="0.4" />
      <circle cx="11" cy="8" r="5" fill="currentColor" />
    </svg>
  )
}

function HaloLegendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="text-muted-foreground">
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <circle cx="8" cy="8" r="5" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

function SessionTooltip(props: TooltipProps<number, string>) {
  const { active, payload } = props
  if (!(active && payload && payload.length)) return null

  const session = payload[0].payload as SessionPoint
  const expected = session.pace + session.paceDelta
  return (
    <ChartTooltipContent
      active={active}
      payload={payload}
      hideLabel
      hideIndicator
      formatter={() => (
        <div className="grid gap-1">
          <span>{session.descriptor}</span>
          <span>{new Date(session.start).toLocaleString()}</span>
          <span>
            Pace: {session.pace.toFixed(2)} min/mi (Δ {session.paceDelta.toFixed(2)})
          </span>
          <span>Expected Pace: {expected.toFixed(2)} min/mi</span>
          <span>Heart Rate: {session.heartRate} bpm</span>
          <span>
            Weather: {session.condition}, {session.temperature}°F, {session.humidity}% hum, {session.wind} mph wind
          </span>
          <span>Confidence: {(session.confidence * 100).toFixed(0)}%</span>
        </div>
      )}
    />
  )
}

function percentile(values: number[], p: number) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.floor((sorted.length - 1) * p)
  return sorted[idx]
}

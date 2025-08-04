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
import { polygonHull, polygonCentroid } from "d3-polygon"
import { contourDensity } from "d3-contour"
import { geoPath } from "d3-geo"
import { Customized, Polygon } from "recharts"
import ClusterCard from "./ClusterCard"

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
  const clusterDetails = clusters.map((c) => {
    const points = data.filter((d) => d.cluster === c)
    const hull = polygonHull(points.map((p) => [p.x, p.y]))
    const centroid = hull
      ? polygonCentroid(hull)
      : [
          points.reduce((sum, p) => sum + p.x, 0) / points.length,
          points.reduce((sum, p) => sum + p.y, 0) / points.length,
        ]
    return { cluster: c, points, hull, centroid }
  })
  const goodRuns = data.filter((d) => d.good)
  const paceThreshold = percentile(goodRuns.map((d) => d.paceDelta), 0.9)
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
          <Customized
            component={
              <ClusterBackground
                clusters={clusterDetails}
                clusterConfig={clusterConfig}
              />
            }
          />
          {clusters.map((c) => (
            <Scatter
              key={c}
              data={data.filter((d) => d.cluster === c)}
              fill={clusterConfig[c].color}
              animationDuration={300}
            />
          ))}
          <Customized
            component={
              <DeviationTrails points={goodRuns} clusters={clusterDetails} />
            }
          />
          <Scatter
            data={goodRuns}
            fill="hsl(var(--chart-6))"
            shape={(props) => (
              <GoodRunSymbol
                {...props}
                paceThreshold={paceThreshold}
              />
            )}
          />
          <Customized
            component={
              <ClusterCentroids
                clusters={clusterDetails}
                clusterConfig={clusterConfig}
              />
            }
          />
        </ScatterChart>
      </ChartContainer>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {clusters.map((c) => (
          <ClusterCard
            key={c}
            data={data.filter((d) => d.cluster === c)}
            color={clusterConfig[c].color}
          />
        ))}
      </div>
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
                fillOpacity={0.05}
                stroke="none"
              />
            ))}
            {hullPoints && (
              <Polygon
                points={hullPoints}
                stroke={color}
                fill={color}
                fillOpacity={0.1}
              />
            )}
          </g>
        )
      })}
    </g>
  )
}

function ClusterCentroids({ clusters, clusterConfig, offset, xAxisMap, yAxisMap }: any) {
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

        return (
          <g key={`centroid-${cluster.cluster}`}>
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

function DeviationTrails({ points, clusters, offset, xAxisMap, yAxisMap }: any) {
  const xAxis = Object.values(xAxisMap)[0]
  const yAxis = Object.values(yAxisMap)[0]
  const xScale = xAxis.scale
  const yScale = yAxis.scale

  return (
    <g>
      {points.map((p: any) => {
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

function GoodRunSymbol({ cx, cy, payload, paceThreshold }: any) {
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
        stroke="hsl(var(--chart-6))"
        strokeOpacity={conf}
        strokeWidth={2}
      />
      <circle
        cx={cx}
        cy={cy}
        r={size}
        fill="hsl(var(--chart-6))"
        stroke="#fff"
        strokeWidth={1}
      />
      {payload.paceDelta >= paceThreshold && (
        <text x={cx} y={cy - size - 2} textAnchor="middle" fontSize={10}>
          ✨
        </text>
      )}
    </g>
  )
}

function percentile(values: number[], p: number) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const idx = Math.floor((sorted.length - 1) * p)
  return sorted[idx]
}

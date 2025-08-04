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
          <Scatter
            data={data.filter((d) => d.good)}
            fill="hsl(var(--chart-6))"
            shape="star"
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

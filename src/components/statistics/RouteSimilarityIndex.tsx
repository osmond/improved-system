"use client"

import { useEffect, useState } from "react"
import ChartCard from "@/components/dashboard/ChartCard"
import { ChartContainer } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { getMockRoutes, calculateRouteSimilarity, Route } from "@/lib/api"

interface SimilarityEdge {
  source: number
  target: number
  similarity: number
}

export default function RouteSimilarityIndex() {
  const [routes, setRoutes] = useState<Route[] | null>(null)

  useEffect(() => {
    getMockRoutes().then(setRoutes)
  }, [])

  if (!routes) return <Skeleton className="h-64" />

  const edges: SimilarityEdge[] = []
  for (let i = 0; i < routes.length; i++) {
    for (let j = i + 1; j < routes.length; j++) {
      const similarity = calculateRouteSimilarity(
        routes[i].points,
        routes[j].points,
      )
      edges.push({ source: i, target: j, similarity })
    }
  }

  const radius = 40
  const center = 50
  const nodes = routes.map((r, i) => {
    const angle = (2 * Math.PI * i) / routes.length
    return {
      ...r,
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  })

  return (
    <ChartCard
      title="Route Similarity Index"
      description="Jaccard similarity between routes"
    >
      <ChartContainer config={{}} className="h-64 md:h-80 lg:h-96">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {edges.map((e, idx) => (
            <line
              key={idx}
              data-testid="similarity-edge"
              x1={nodes[e.source].x}
              y1={nodes[e.source].y}
              x2={nodes[e.target].x}
              y2={nodes[e.target].y}
              stroke="hsl(var(--chart-1))"
              strokeWidth={1 + e.similarity * 2}
              strokeOpacity={e.similarity}
            />
          ))}
          {nodes.map((n) => (
            <g key={n.name}>
              <circle cx={n.x} cy={n.y} r={3} fill="hsl(var(--chart-2))" />
              <text
                x={n.x}
                y={n.y - 6}
                textAnchor="middle"
                fontSize="3"
                fill="currentColor"
              >
                {n.name}
              </text>
            </g>
          ))}
        </svg>
      </ChartContainer>
    </ChartCard>
  )
}


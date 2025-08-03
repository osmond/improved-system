import type { RouteRun } from './api'

// Pre-defined sample route runs to display on initial load
// Coordinates are around Madison, WI (approx. 43.079° N, 89.4° W)
const initialRouteRuns: RouteRun[] = [
  {
    id: 1,
    name: "Lakeshore Path",
    timestamp: "2024-07-01T10:00:00.000Z",
    points: [
      { lat: 43.076, lon: -89.401 },
      { lat: 43.077, lon: -89.402 },
      { lat: 43.078, lon: -89.403 },
    ],
    novelty: 0.9,
    dtwSimilarity: 0.05,
    overlapSimilarity: 0.05,
  },
  {
    id: 2,
    name: "Campus Loop",
    timestamp: "2024-07-02T10:00:00.000Z",
    points: [
      { lat: 43.071, lon: -89.405 },
      { lat: 43.072, lon: -89.406 },
      { lat: 43.073, lon: -89.407 },
    ],
    novelty: 0.6,
    dtwSimilarity: 0.25,
    overlapSimilarity: 0.15,
  },
  {
    id: 3,
    name: "Downtown Sprint",
    timestamp: "2024-07-03T10:00:00.000Z",
    points: [
      { lat: 43.079, lon: -89.39 },
      { lat: 43.08, lon: -89.391 },
      { lat: 43.081, lon: -89.392 },
    ],
    novelty: 0.3,
    dtwSimilarity: 0.5,
    overlapSimilarity: 0.4,
  },
]

const routeRuns: RouteRun[] = [...initialRouteRuns]

export function resetRouteRuns(): void {
  routeRuns.length = 0
  routeRuns.push(...initialRouteRuns)
}

export async function trackRouteRun(run: RouteRun): Promise<void> {
  routeRuns.push(run)
}

export async function fetchRouteRunHistory(): Promise<RouteRun[]> {
  return routeRuns
}

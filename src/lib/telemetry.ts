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
  {
    id: 4,
    name: "Capitol Circle",
    timestamp: "2024-07-04T10:00:00.000Z",
    points: [
      { lat: 43.074, lon: -89.384 },
      { lat: 43.075, lon: -89.385 },
      { lat: 43.076, lon: -89.386 },
      { lat: 43.077, lon: -89.387 },
    ],
    novelty: 0.7,
    dtwSimilarity: 0.2,
    overlapSimilarity: 0.1,
  },
  {
    id: 5,
    name: "Arboretum Trek",
    timestamp: "2024-07-05T10:00:00.000Z",
    points: [
      { lat: 43.058, lon: -89.417 },
      { lat: 43.059, lon: -89.418 },
      { lat: 43.06, lon: -89.419 },
      { lat: 43.061, lon: -89.42 },
    ],
    novelty: 0.8,
    dtwSimilarity: 0.1,
    overlapSimilarity: 0.1,
  },
  {
    id: 6,
    name: "Monona Bay Loop",
    timestamp: "2024-07-06T10:00:00.000Z",
    points: [
      { lat: 43.066, lon: -89.379 },
      { lat: 43.067, lon: -89.38 },
      { lat: 43.068, lon: -89.381 },
      { lat: 43.069, lon: -89.382 },
    ],
    novelty: 0.5,
    dtwSimilarity: 0.35,
    overlapSimilarity: 0.2,
  },
  {
    id: 7,
    name: "Goodman Park Jog",
    timestamp: "2024-07-07T10:00:00.000Z",
    points: [
      { lat: 43.051, lon: -89.39 },
      { lat: 43.052, lon: -89.391 },
      { lat: 43.053, lon: -89.392 },
      { lat: 43.054, lon: -89.393 },
    ],
    novelty: 0.4,
    dtwSimilarity: 0.45,
    overlapSimilarity: 0.3,
  },
  {
    id: 8,
    name: "Allied Drive Dash",
    timestamp: "2024-07-08T10:00:00.000Z",
    points: [
      { lat: 43.037, lon: -89.42 },
      { lat: 43.038, lon: -89.421 },
      { lat: 43.039, lon: -89.422 },
      { lat: 43.04, lon: -89.423 },
    ],
    novelty: 0.2,
    dtwSimilarity: 0.55,
    overlapSimilarity: 0.5,
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
  return routeRuns.map((r) => ({ ...r, points: [...r.points] }))
}

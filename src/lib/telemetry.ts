import type { RouteRun } from './api'

const routeRuns: RouteRun[] = []

export async function trackRouteRun(run: RouteRun): Promise<void> {
  routeRuns.push(run)
}

export async function fetchRouteRunHistory(): Promise<RouteRun[]> {
  return routeRuns
}

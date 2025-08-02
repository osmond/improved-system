import { useMemo } from 'react'
import { Route } from '@/lib/api'
import { computeRouteMetrics } from '@/lib/routeMetrics'

/**
 * React hook to compute the Jaccard similarity between two routes.
 * The result is memoized and recomputed whenever either route or the
 * rounding precision changes.
 */
export function useRouteSimilarity(
  routeA?: Route,
  routeB?: Route,
  precision = 3,
): number | null {
  return useMemo(() => {
    if (!routeA || !routeB) return null
    const { overlapSimilarity } = computeRouteMetrics(
      routeA.points,
      routeB.points,
      precision,
    )
    return overlapSimilarity
  }, [routeA, routeB, precision])
}

export default useRouteSimilarity


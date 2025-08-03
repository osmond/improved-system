import { useMemo } from 'react'
import { Route } from '@/lib/api'
import { computeRouteMetrics } from '@/lib/routeMetrics'

/**
 * React hook to compute similarity metrics between two routes.
 * The result is memoized and recomputed whenever either route or the
 * rounding precision changes.
 */
export function useRouteSimilarity(
  routeA?: Route,
  routeB?: Route,
  precision = 3,
):
  | {
      overlapSimilarity: number
      dtwSimilarity: number
      maxSimilarity: number
    }
  | null {
  return useMemo(() => {
    if (!routeA || !routeB) return null
    return computeRouteMetrics(routeA.points, routeB.points, precision)
  }, [routeA, routeB, precision])
}

export default useRouteSimilarity


import { useMemo } from 'react'
import { calculateRouteSimilarity, Route } from '@/lib/api'

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
    return calculateRouteSimilarity(routeA.points, routeB.points, precision)
  }, [routeA, routeB, precision])
}

export default useRouteSimilarity


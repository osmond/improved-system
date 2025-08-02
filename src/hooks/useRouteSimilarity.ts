import { useEffect, useState } from 'react'
import { getMockRoutes, calculateRouteSimilarity, Route } from '@/lib/api'

export interface RouteSimilarityResult {
  routeA: Route
  routeB: Route
  similarity: number
}

export function useRouteSimilarity(): RouteSimilarityResult | null {
  const [result, setResult] = useState<RouteSimilarityResult | null>(null)

  useEffect(() => {
    getMockRoutes().then((routes) => {
      if (routes.length < 2) return
      const [routeA, routeB] = routes
      const similarity = calculateRouteSimilarity(routeA.points, routeB.points)
      setResult({ routeA, routeB, similarity })
    })
  }, [])

  return result
}

export default useRouteSimilarity

import { useMemo } from 'react'
import type { ClusterMetrics } from './useRunningSessions'

function clusterName(id: number) {
  return `Cluster ${String.fromCharCode(65 + id)}`
}

export function useSessionInsights(
  stats: Record<number, ClusterMetrics> | null,
): string[] {
  return useMemo(() => {
    if (!stats) return []
    const entries = Object.entries(stats)
    if (!entries.length) return []
    const [maxGood] = entries.reduce((a, b) =>
      b[1].goodRuns > a[1].goodRuns ? b : a,
    )
    const [maxVar] = entries.reduce((a, b) =>
      b[1].variance > a[1].variance ? b : a,
    )
    const [maxBreach] = entries.reduce((a, b) =>
      b[1].boundaryBreaches > a[1].boundaryBreaches ? b : a,
    )
    return [
      `${clusterName(Number(maxGood))} yields most good runs.`,
      `${clusterName(Number(maxVar))} shows highest variance.`,
      `${clusterName(Number(maxBreach))} has most boundary breaches.`,
    ]
  }, [stats])
}

export default useSessionInsights

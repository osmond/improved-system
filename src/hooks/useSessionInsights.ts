import { useMemo } from 'react'
import type { ClusterMetrics } from './useRunningSessions'

function clusterName(id: number) {
  return `Cluster ${String.fromCharCode(65 + id)}`
}

export function useSessionInsights(
  stats: Record<number, ClusterMetrics> | null,
  stability: Record<number, number> | null,
  names?: Record<number, string>,
): { narrative: string; tips: string[] } {
  return useMemo(() => {
    const tips: string[] = []
    if (!stats) return { narrative: '', tips }
    const entries = Object.entries(stats)
    if (!entries.length) return { narrative: '', tips }
    const [maxGood] = entries.reduce((a, b) =>
      b[1].goodRuns > a[1].goodRuns ? b : a,
    )
    const [maxVar] = entries.reduce((a, b) =>
      b[1].variance > a[1].variance ? b : a,
    )
    const [maxBreach] = entries.reduce((a, b) =>
      b[1].boundaryBreaches > a[1].boundaryBreaches ? b : a,
    )
    tips.push(
      `${clusterName(Number(maxGood))} yields most good runs.`,
      `${clusterName(Number(maxVar))} shows highest variance.`,
      `${clusterName(Number(maxBreach))} has most boundary breaches.`,
    )

    let narrative = ''
    if (stability) {
      const stEntries = Object.entries(stability)
      if (stEntries.length >= 2) {
        const sorted = stEntries.sort((a, b) => b[1] - a[1])
        const first = sorted[0]
        const last = sorted[sorted.length - 1]
        const label = (s: number) => (s > 0.7 ? 'Steady' : 'High Δ')
        const name = (id: number) => names?.[id] || clusterName(id)
        narrative = `You drifted from ${name(Number(first[0]))} ${label(
          first[1],
        )} to ${name(Number(last[0]))} ${label(last[1])}`
      }
    }

    return { narrative, tips }
  }, [stats, stability, names])
}

export default useSessionInsights

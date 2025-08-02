import type { LatLon } from './api'

export function calculateRouteSimilarity(
  a: LatLon[],
  b: LatLon[],
  precision = 3,
): number {
  const toKey = ({ lat, lon }: LatLon) => `${lat.toFixed(precision)},${lon.toFixed(precision)}`
  const setA = new Set(a.map(toKey))
  const setB = new Set(b.map(toKey))
  const intersection = [...setA].filter((p) => setB.has(p))
  const union = new Set([...setA, ...setB])
  return union.size === 0 ? 0 : intersection.length / union.size
}

function dtwDistance(a: LatLon[], b: LatLon[]): number {
  const n = a.length
  const m = b.length
  const dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(Infinity))
  dp[0][0] = 0
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = Math.hypot(
        a[i - 1].lat - b[j - 1].lat,
        a[i - 1].lon - b[j - 1].lon,
      )
      dp[i][j] = cost + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    }
  }
  return dp[n][m] / (n + m)
}

export function computeRouteMetrics(
  a: LatLon[],
  b: LatLon[],
  precision = 3,
): { overlapSimilarity: number; dtwSimilarity: number; maxSimilarity: number } {
  const overlapSimilarity = calculateRouteSimilarity(a, b, precision)
  const dtwSimilarity = 1 / (1 + dtwDistance(a, b))
  const maxSimilarity = Math.max(overlapSimilarity, dtwSimilarity)
  return { overlapSimilarity, dtwSimilarity, maxSimilarity }
}


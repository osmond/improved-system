import type { LatLon } from './api'

const EARTH_RADIUS = 6_371_000 // meters

/**
 * Compute the great-circle distance between two latitude/longitude pairs
 * using the haversine formula.
 *
 * The result is returned in meters, allowing callers to reason about real
 * world distances rather than raw degree differences.
 */
export function haversineDistance(a: LatLon, b: LatLon): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLon = toRad(b.lon - a.lon)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h))
}

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
      // Convert the haversine distance (meters) to angular degrees to
      // preserve the scale used by the original implementation that
      // operated directly on degree differences.
      const cost =
        (haversineDistance(a[i - 1], b[j - 1]) / EARTH_RADIUS) *
        (180 / Math.PI);
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


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
  let n = a.length
  let m = b.length
  const lenSum = n + m

  if (n === 0 && m === 0) return 0
  if (n === 0 || m === 0) return Infinity

  // Ensure `b` is the shorter sequence so we allocate only O(min(n, m)) memory
  if (m > n) {
    ;[a, b] = [b, a]
    ;[n, m] = [m, n]
  }

  let prev = new Array(m + 1).fill(Infinity)
  let curr = new Array(m + 1).fill(Infinity)
  prev[0] = 0

  for (let i = 1; i <= n; i++) {
    curr[0] = Infinity
    for (let j = 1; j <= m; j++) {
      // Convert the haversine distance (meters) to angular degrees to
      // preserve the scale used by the original implementation that
      // operated directly on degree differences.
      const cost =
        (haversineDistance(a[i - 1], b[j - 1]) / EARTH_RADIUS) *
        (180 / Math.PI)
      curr[j] = cost + Math.min(prev[j], curr[j - 1], prev[j - 1])
    }
    ;[prev, curr] = [curr, prev]
  }

  return prev[m] / lenSum
}

export function computeRouteMetrics(
  a: LatLon[],
  b: LatLon[],
  precision = 3,
): { overlapSimilarity: number; dtwSimilarity: number; maxSimilarity: number } {
  const overlapSimilarity = calculateRouteSimilarity(a, b, precision)
  const distance = dtwDistance(a, b)
  const dtwSimilarity = Number.isNaN(distance) ? 0 : 1 / (1 + distance)
  const maxSimilarity = Math.max(overlapSimilarity, dtwSimilarity)
  return { overlapSimilarity, dtwSimilarity, maxSimilarity }
}


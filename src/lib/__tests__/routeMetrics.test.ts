import { describe, it, expect } from 'vitest'
import { computeRouteMetrics } from '../routeMetrics'
import type { LatLon } from '../api'

describe('computeRouteMetrics - DTW similarity', () => {
  it('returns perfect similarity for identical single-point routes', () => {
    const route: LatLon[] = [{ lat: 0, lon: 0 }]
    const metrics = computeRouteMetrics(route, route)
    expect(metrics.overlapSimilarity).toBe(1)
    expect(metrics.dtwSimilarity).toBe(1)
    expect(metrics.maxSimilarity).toBe(1)
  })

  it('computes expected DTW similarity for diverging simple routes', () => {
    const a: LatLon[] = [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 1 },
    ]
    const b: LatLon[] = [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 2 },
    ]
    const metrics = computeRouteMetrics(a, b)
    expect(metrics.overlapSimilarity).toBeCloseTo(1 / 3)
    expect(metrics.dtwSimilarity).toBeCloseTo(0.8)
    expect(metrics.maxSimilarity).toBeCloseTo(0.8)
  })
})

describe('computeRouteMetrics - overlap vs DTW dominance', () => {
  it('uses overlap similarity when higher than DTW', () => {
    const a: LatLon[] = [
      { lat: 0, lon: 0 },
      { lat: 0, lon: 1 },
    ]
    const b: LatLon[] = [
      { lat: 0, lon: 1 },
      { lat: 0, lon: 0 },
    ]
    const metrics = computeRouteMetrics(a, b)
    expect(metrics.overlapSimilarity).toBe(1)
    expect(metrics.dtwSimilarity).toBeCloseTo(2 / 3)
    expect(metrics.maxSimilarity).toBe(1)
  })

  it('handles single-point routes with different points', () => {
    const a: LatLon[] = [{ lat: 0, lon: 0 }]
    const b: LatLon[] = [{ lat: 0, lon: 1 }]
    const metrics = computeRouteMetrics(a, b)
    expect(metrics.overlapSimilarity).toBe(0)
    expect(metrics.dtwSimilarity).toBeCloseTo(2 / 3)
    expect(metrics.maxSimilarity).toBeCloseTo(2 / 3)
  })

  it('handles empty routes', () => {
    const metrics = computeRouteMetrics([], [])
    expect(metrics.overlapSimilarity).toBe(0)
    expect(metrics.dtwSimilarity).toBe(1)
    expect(metrics.maxSimilarity).toBe(1)
  })
})

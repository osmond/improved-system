import { describe, it, expect } from 'vitest'
import { calculateRouteSimilarity, LatLon } from '../api'

describe('calculateRouteSimilarity', () => {
  it('returns 1 for identical routes', () => {
    const route: LatLon[] = [
      { lat: 0, lon: 0 },
      { lat: 1, lon: 1 },
    ]
    expect(calculateRouteSimilarity(route, route)).toBe(1)
  })

  it('returns 0 for disjoint routes', () => {
    const a: LatLon[] = [{ lat: 0, lon: 0 }]
    const b: LatLon[] = [{ lat: 10, lon: 10 }]
    expect(calculateRouteSimilarity(a, b)).toBe(0)
  })
})

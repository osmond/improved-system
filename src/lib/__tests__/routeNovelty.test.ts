import { describe, it, expect, afterAll } from 'vitest'
import {
  computeRouteNovelty,
  recordRouteRun,
  getRouteRunHistory,
  resetRouteHistory,
  LatLon,
  type RouteRun,
} from '../api'
import { computeNoveltyTrend } from '../utils'

describe('computeRouteNovelty', () => {
  it('returns 1 when no history', () => {
    const route: LatLon[] = [{ lat: 0, lon: 0 }]
    expect(computeRouteNovelty(route, []).novelty).toBe(1)
  })
})

describe('recordRouteRun', () => {
  it('stores runs and calculates novelty', async () => {
    resetRouteHistory()
    const a: LatLon[] = [
      { lat: 0, lon: 0 },
      { lat: 1, lon: 1 },
    ]
    const b: LatLon[] = [
      { lat: 0, lon: 0 },
      { lat: 1.05, lon: 1.05 },
    ]
    const c: LatLon[] = [{ lat: 10, lon: 10 }]

    const initial = await getRouteRunHistory()
    const startId = initial.length + 1

    const run1 = await recordRouteRun(a)
    const run2 = await recordRouteRun(b)
    const run3 = await recordRouteRun(c)

    expect(run1.id).toBe(startId)
    expect(run1.name).toBe(`Run ${startId}`)
    expect(run2.id).toBe(startId + 1)
    expect(run2.name).toBe(`Run ${startId + 1}`)
    expect(run3.id).toBe(startId + 2)
    expect(run3.name).toBe(`Run ${startId + 2}`)
    expect(run1.novelty).toBeGreaterThan(0.98)
    expect(run2.novelty).toBeLessThan(0.05)
    expect(run3.novelty).toBeGreaterThan(0.8)
    await getRouteRunHistory()
    expect(run2).toHaveProperty('dtwSimilarity')
    expect(run2).toHaveProperty('overlapSimilarity')
  })
})

describe('computeNoveltyTrend', () => {
  it('flags prolonged low novelty', () => {
    const today = new Date()
    const runs: RouteRun[] = Array.from({ length: 20 }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (19 - i))
      return {
        id: i + 1,
        name: `Run ${i + 1}`,
        timestamp: d.toISOString(),
        points: [],
        novelty: i < 7 ? 0.9 : 0.1,

        dtwSimilarity: 0,
        overlapSimilarity: 0,

      }
    })
    const { trend, prolongedLow } = computeNoveltyTrend(runs, 7, 0.2)
    expect(trend).toHaveLength(20)
    expect(prolongedLow).toBe(true)
  })
})

afterAll(() => {
  resetRouteHistory()
})

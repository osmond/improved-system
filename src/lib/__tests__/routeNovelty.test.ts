import { describe, it, expect } from 'vitest'
import {
  computeRouteNovelty,
  recordRouteRun,
  getRouteRunHistory,
  LatLon,
} from '../api'
import { computeNoveltyTrend } from '../utils'

describe('computeRouteNovelty', () => {
  it('returns 1 when no history', () => {
    const route: LatLon[] = [{ lat: 0, lon: 0 }]
    expect(computeRouteNovelty(route, [])).toBe(1)
  })
})

describe('recordRouteRun', () => {
  it('stores runs and calculates novelty', async () => {
    const a: LatLon[] = [
      { lat: 0, lon: 0 },
      { lat: 1, lon: 1 },
    ]
    const b: LatLon[] = [
      { lat: 0, lon: 0 },
      { lat: 1.05, lon: 1.05 },
    ]
    const c: LatLon[] = [{ lat: 10, lon: 10 }]

    const run1 = await recordRouteRun(a)
    const run2 = await recordRouteRun(b)
    const run3 = await recordRouteRun(c)

    expect(run1.id).toBe(1)
    expect(run1.name).toBe('Run 1')
    expect(run2.id).toBe(2)
    expect(run2.name).toBe('Run 2')
    expect(run3.id).toBe(3)
    expect(run3.name).toBe('Run 3')
    expect(run1.novelty).toBe(1)
    expect(run2.novelty).toBeLessThan(0.05)
    expect(run3.novelty).toBeGreaterThan(0.8)
    const history = await getRouteRunHistory()
    expect(history).toHaveLength(3)
    expect(run2).toHaveProperty('dtwSimilarity')
    expect(run2).toHaveProperty('overlapSimilarity')
  })
})

describe('computeNoveltyTrend', () => {
  it('flags prolonged low novelty', () => {
    const today = new Date()
    const runs = Array.from({ length: 20 }, (_, i) => {
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

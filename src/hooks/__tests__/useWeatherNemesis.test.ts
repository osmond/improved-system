import { describe, it, expect } from 'vitest'
import { computeWeatherNemesis } from '../useWeatherNemesis'
import type { RunEnvironmentPoint } from '@/lib/api'

describe('computeWeatherNemesis', () => {
  it('finds slowest condition', () => {
    const points: RunEnvironmentPoint[] = [
      { pace: 7, temperature: 70, humidity: 50, wind: 5, elevation: 0 },
      { pace: 8, temperature: 78, humidity: 60, wind: 5, elevation: 0 },
      { pace: 6.5, temperature: 65, humidity: 40, wind: 5, elevation: 0 },
      { pace: 8.5, temperature: 80, humidity: 60, wind: 5, elevation: 0 },
    ]
    const result = computeWeatherNemesis(points)
    expect(result).not.toBeNull()
    expect(result?.temperature).toBe(80)
    expect(result?.humidity).toBe(60)
    expect(result?.pace).toBeCloseTo(8.25)
  })
})

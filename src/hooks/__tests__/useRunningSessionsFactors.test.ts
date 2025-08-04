import { describe, it, expect } from 'vitest'
import { computeExpected } from '@/hooks/useRunningSessions'
import type { RunningSession } from '@/lib/api'

describe('computeExpected', () => {
  it('derives tailwind and stable HR factors', () => {
    const session: RunningSession = {
      id: 1,
      pace: 6,
      duration: 30,
      heartRate: 130,
      date: '2024-01-01',
      start: '2024-01-01T08:00:00Z',
      lat: 0,
      lon: 0,
      weather: { temperature: 50, humidity: 40, wind: -5, condition: 'Clear' },
    }
    const { factors } = computeExpected(session)
    expect(factors.some((f) => f.label === 'Tailwind')).toBe(true)
    expect(factors.some((f) => f.label === 'Stable HR')).toBe(true)
  })
})

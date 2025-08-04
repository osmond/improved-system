import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useTrainingConsistency, {
  computeConsistencyScore,
  computeMostConsistentDay,
  computePreferredTrainingHour,
} from '../useTrainingConsistency'
import type { RunningSession } from '@/lib/api'
import { getRunningSessions } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  __esModule: true,
  getRunningSessions: vi.fn(),
}))

describe('training consistency metrics', () => {
  const sessions: RunningSession[] = [
    {
      id: 1,
      pace: 6,
      duration: 30,
      heartRate: 130,
      date: '2023-01-02',
      start: '2023-01-02T06:00:00Z',
      lat: 0,
      lon: 0,
      weather: { temperature: 0, humidity: 0, wind: 0, condition: '' },
    },
    {
      id: 2,
      pace: 6,
      duration: 30,
      heartRate: 130,
      date: '2023-01-09',
      start: '2023-01-09T06:00:00Z',
      lat: 0,
      lon: 0,
      weather: { temperature: 0, humidity: 0, wind: 0, condition: '' },
    },
    {
      id: 3,
      pace: 6,
      duration: 30,
      heartRate: 130,
      date: '2023-01-03',
      start: '2023-01-03T07:00:00Z',
      lat: 0,
      lon: 0,
      weather: { temperature: 0, humidity: 0, wind: 0, condition: '' },
    },
  ]

  it('computes consistency score', () => {
    const expected =
      1 -
      (-(
        (2 / 3) * Math.log2(2 / 3) +
        (1 / 3) * Math.log2(1 / 3)
      )) /
        Math.log2(168)
    expect(computeConsistencyScore(sessions)).toBeCloseTo(expected)
  })

  it('finds most consistent day', () => {
    expect(computeMostConsistentDay(sessions)).toBe(1)
  })

  it('finds preferred training hour', () => {
    expect(computePreferredTrainingHour(sessions)).toBe(6)
  })
})

describe('useTrainingConsistency timeframe filtering', () => {
  it('filters sessions based on timeframe', async () => {
    const now = new Date()
    const createSession = (offset: number): RunningSession => {
      const d = new Date(now)
      d.setDate(d.getDate() - offset)
      return {
        id: offset,
        pace: 6,
        duration: 30,
        heartRate: 130,
        date: d.toISOString().slice(0, 10),
        start: d.toISOString(),
        lat: 0,
        lon: 0,
        weather: { temperature: 0, humidity: 0, wind: 0, condition: '' },
      }
    }
    const mockSessions: RunningSession[] = [
      createSession(4),
      createSession(17),
      createSession(40),
    ]
    ;(getRunningSessions as any).mockResolvedValue(mockSessions)

    const { result, rerender } = renderHook(({ tf }) => useTrainingConsistency(tf), {
      initialProps: { tf: '30d' },
    })

    await waitFor(() => expect(result.current.data).not.toBeNull())
    expect(result.current.data?.sessions.length).toBe(2)

    rerender({ tf: '7d' })
    await waitFor(() =>
      result.current.data?.sessions.length !== undefined &&
      result.current.data.sessions.length < 2,
    )
    expect(result.current.data?.sessions.length).toBe(1)
  })
})

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import useFragilityHistory from '../useFragilityHistory'
import { getWeeklyVolume, getHourlySteps, type WeeklyVolumePoint, type HourlySteps } from '@/lib/api'
import { computeFragilityIndex } from '../useFragilityIndex'

vi.mock('@/lib/api', () => ({
  __esModule: true,
  getWeeklyVolume: vi.fn(),
  getHourlySteps: vi.fn(),
}))

afterEach(() => {
  vi.clearAllMocks()
})

function makeDay(date: string, steps: number): HourlySteps[] {
  return Array.from({ length: 24 }, (_, h) => ({
    timestamp: `${date}T${String(h).padStart(2, '0')}:00:00Z`,
    steps,
  }))
}

describe('useFragilityHistory', () => {
  it('returns ordered fragility points and skips missing days', async () => {
    const weekly: WeeklyVolumePoint[] = [
      { week: '2025-W30', miles: 10 },
      { week: '2025-W31', miles: 20 },
    ]
    const day1 = makeDay('2025-07-21', 100)
    const day2 = makeDay('2025-07-22', 200)
    const day3 = makeDay('2025-07-24', 150)

    ;(getWeeklyVolume as any).mockResolvedValue(weekly)
    ;(getHourlySteps as any).mockResolvedValue([...day1, ...day2, ...day3])

    const { result } = renderHook(() => useFragilityHistory())
    await waitFor(() => expect(result.current).not.toBeNull())

    const expected = [
      {
        date: '2025-07-22',
        value: computeFragilityIndex([weekly[0]], [...day1, ...day2]).index,
      },
      {
        date: '2025-07-24',
        value: computeFragilityIndex([weekly[0]], [...day1, ...day2, ...day3]).index,
      },
    ]

    expect(result.current).toEqual(expected)
    expect(result.current?.map((p) => p.date)).toEqual(['2025-07-22', '2025-07-24'])
  })

  it('handles missing weekly data', async () => {
    const day1 = makeDay('2025-07-21', 100)
    const day2 = makeDay('2025-07-22', 200)
    ;(getWeeklyVolume as any).mockResolvedValue([])
    ;(getHourlySteps as any).mockResolvedValue([...day1, ...day2])

    const { result } = renderHook(() => useFragilityHistory())
    await waitFor(() => expect(result.current).not.toBeNull())

    expect(result.current).toEqual([{ date: '2025-07-22', value: 0 }])
  })

  it('returns empty history when hourly data insufficient', async () => {
    const day1 = makeDay('2025-07-21', 100)
    ;(getWeeklyVolume as any).mockResolvedValue([{ week: '2025-W30', miles: 10 }])
    ;(getHourlySteps as any).mockResolvedValue([...day1])

    const { result } = renderHook(() => useFragilityHistory())
    await waitFor(() => expect(result.current).not.toBeNull())

    expect(result.current).toEqual([])
  })
})


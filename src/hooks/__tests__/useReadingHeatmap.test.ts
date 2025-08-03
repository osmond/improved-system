import { describe, it, expect } from 'vitest'
import { computeReadingHeatmap, computeHeatmapFromActivity } from '../useReadingHeatmap'
import type { ReadingSession, ActivitySnapshot } from '@/lib/api'

describe('computeReadingHeatmap', () => {
  it('bins by hour and weekday', () => {
    const sessions: ReadingSession[] = [
      {
        timestamp: '2025-07-28T10:00:00Z',
        intensity: 0.5,
        medium: 'phone',
        duration: 30,
      },
      {
        timestamp: '2025-07-28T10:30:00Z',
        intensity: 0.7,
        medium: 'phone',
        duration: 15,
      },
      {
        timestamp: '2025-07-29T11:00:00Z',
        intensity: 0.2,
        medium: 'kindle',
        duration: 20,
      },
    ]
    const result = computeReadingHeatmap(sessions)
    expect(result.length).toBe(168)
    const mon10 = result.find((c) => c.day === 1 && c.hour === 10)
    const tue11 = result.find((c) => c.day === 2 && c.hour === 11)
    expect(mon10?.intensity).toBeCloseTo(0.6)
    expect(tue11?.intensity).toBeCloseTo(0.2)
  })
})

describe('computeHeatmapFromActivity', () => {
  it('accounts for device fragmentation', () => {
    const snaps: ActivitySnapshot[] = [
      {
        timestamp: '2025-07-28T10:00:00Z',
        heartRate: 60,
        steps: 50,
        appChanges: 0,
        inputCadence: 150,
        location: 'home',
        network: 'wifi_home',
      },
      {
        timestamp: '2025-07-28T11:00:00Z',
        heartRate: 60,
        steps: 50,
        appChanges: 6,
        inputCadence: 5,
        location: 'office',
        network: 'wifi_office',
      },
    ]
    const result = computeHeatmapFromActivity(snaps)
    expect(result.length).toBe(168)
    const mon10 = result.find((c) => c.day === 1 && c.hour === 10)
    const mon11 = result.find((c) => c.day === 1 && c.hour === 11)
    expect(mon10 && mon11).not.toBeUndefined()
    expect(mon10!.intensity).toBeGreaterThan(mon11!.intensity)
    expect(mon11!.fragmentation).toBeGreaterThan(mon10!.fragmentation ?? 0)
  })
})

import { describe, it, expect } from 'vitest'
import { detectFragmentation } from '../useFragmentation'
import type { ActivitySnapshot } from '@/lib/api'

describe('detectFragmentation', () => {
  it('flags snapshots with high app switches', () => {
    const snaps: ActivitySnapshot[] = [
      {
        timestamp: '2025-07-28T10:00:00Z',
        heartRate: 60,
        steps: 10,
        appChanges: 1,
        inputCadence: 100,
        location: 'home',
        network: 'wifi_home',
      },
      {
        timestamp: '2025-07-28T11:00:00Z',
        heartRate: 60,
        steps: 10,
        appChanges: 6,
        inputCadence: 100,
        location: 'home',
        network: 'wifi_home',
      },
    ]
    const events = detectFragmentation(snaps, 5)
    expect(events.length).toBe(1)
    expect(events[0].timestamp).toBe('2025-07-28T11:00:00Z')
  })
})


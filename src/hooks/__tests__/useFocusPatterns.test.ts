import { describe, it, expect } from 'vitest'
import { computeFocusPatterns } from '../useFocusPatterns'
import type { FocusSession } from '@/lib/api'

describe('computeFocusPatterns', () => {
  it('aggregates duration and counts by hour and label', () => {
    const sessions: FocusSession[] = [
      { start: '2025-07-28T10:00:00Z', duration: 30, label: 'Deep Dive' },
      { start: '2025-07-28T10:30:00Z', duration: 20, label: 'Deep Dive' },
      { start: '2025-07-28T11:00:00Z', duration: 15, label: 'Skim' },
    ]
    const res = computeFocusPatterns(sessions)
    const h10 = res.find((r) => r.hour === 10 && r.label === 'Deep Dive')
    const h11 = res.find((r) => r.hour === 11 && r.label === 'Skim')
    expect(h10?.totalDuration).toBe(50)
    expect(h10?.sessionCount).toBe(2)
    expect(h11?.sessionCount).toBe(1)
  })
})


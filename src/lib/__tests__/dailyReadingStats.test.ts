import { describe, it, expect } from 'vitest'
import { getDailyReadingStats } from '@/lib/api'

// Expected sample data
const sample = [
  { date: '2025-01-01', minutes: 30, pages: 20 },
  { date: '2025-01-02', minutes: 25, pages: 15 },
  { date: '2025-01-03', minutes: 40, pages: 30 }
]

describe('getDailyReadingStats', () => {
  it('returns daily reading stats from dataset', async () => {
    const data = await getDailyReadingStats()
    expect(data).toEqual(sample)
  })
})

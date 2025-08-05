import { describe, it, expect } from 'vitest'
import { getDailyReadingStats } from '@/lib/api'

// Expected first entries from dataset
const sample = [
  { date: '2018-01-09', minutes: 0.07166666666666667, pages: 3 },
  { date: '2018-01-11', minutes: 0, pages: 0 },
  { date: '2018-01-12', minutes: 2.0416666666666665, pages: 5 }
]

describe('getDailyReadingStats', () => {
  it('returns daily reading stats from dataset', async () => {
    const data = await getDailyReadingStats()
    expect(data.length).toBeGreaterThan(sample.length)
    expect(data.slice(0, 3)).toEqual(sample)
  })
})

import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import useDailyReading from '../useDailyReading'

const sample = [
  { date: '2018-01-09', minutes: 0.07166666666666667, pages: 3 },
  { date: '2018-01-11', minutes: 0, pages: 0 },
  { date: '2018-01-12', minutes: 2.0416666666666665, pages: 5 }
]

describe('useDailyReading', () => {
  it('fetches daily reading data', async () => {
    const { result } = renderHook(() => useDailyReading())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBeNull()
    expect(result.current.data.slice(0, 3)).toEqual(sample)
  })
})

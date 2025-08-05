import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import useDailyReading from '../useDailyReading'

const sample = [
  { date: '2025-01-01', minutes: 30, pages: 20 },
  { date: '2025-01-02', minutes: 25, pages: 15 },
  { date: '2025-01-03', minutes: 40, pages: 30 }
]

describe('useDailyReading', () => {
  it('fetches daily reading data', async () => {
    const { result } = renderHook(() => useDailyReading())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBeNull()
    expect(result.current.data).toEqual(sample)
  })
})

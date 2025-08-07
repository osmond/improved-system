import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import useReadingSessions from '../useReadingSessions'
import { getKindleSessions } from '@/lib/api'

vi.mock('@/lib/api', () => ({
  __esModule: true,
  getKindleSessions: vi.fn(),
}))

describe('useReadingSessions', () => {
  it('returns sessions on success', async () => {
    const sessions = [
      { start: '2025-07-30T10:00:00Z', end: '2025-07-30T10:10:00Z', asin: 'A', title: 'Book A', duration: 10, highlights: 0 },
    ]
    ;(getKindleSessions as any).mockResolvedValue(sessions)
    const { result } = renderHook(() => useReadingSessions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.data).toEqual(sessions)
    expect(result.current.error).toBeNull()
  })

  it('sets error when request fails', async () => {
    const err = new Error('fail')
    ;(getKindleSessions as any).mockRejectedValue(err)
    const { result } = renderHook(() => useReadingSessions())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.error).toBe(err)
    expect(result.current.data).toBeNull()
  })
})

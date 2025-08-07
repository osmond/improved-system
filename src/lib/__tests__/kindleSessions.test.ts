import { describe, it, expect, vi, afterEach } from 'vitest'
import { getKindleSessions } from '../api'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getKindleSessions', () => {
  it('returns sessions on successful fetch', async () => {
    const sessions = [
      { start: '2025-07-30T10:00:00Z', end: '2025-07-30T10:10:00Z', asin: 'A', title: 'Book A', duration: 10, highlights: 0 },
    ]
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(sessions),
    }))
    const result = await getKindleSessions()
    expect(result).toEqual(sessions)
  })

  it('throws when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    await expect(getKindleSessions()).rejects.toThrow('network')
  })

  it('throws when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    }))
    await expect(getKindleSessions()).rejects.toThrow(/Failed to fetch Kindle sessions/)
  })
})

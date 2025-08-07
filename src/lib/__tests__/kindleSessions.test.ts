import { describe, it, expect, vi, afterEach } from 'vitest'
import { getKindleSessions } from '../api'
import rawSessions from '../../data/kindle/sessions.json'
import asinTitleMap from '../../data/kindle/asin-title-map.json'

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

  it('returns local data when fetch rejects', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network')))
    const result = await getKindleSessions()
    const expected = (rawSessions as any[]).map((s) => ({
      ...s,
      title: (asinTitleMap as Record<string, string>)[s.asin] ?? s.asin,
    }))
    expect(result).toEqual(expected)
  })

  it('returns local data when response is not ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    }))
    const result = await getKindleSessions()
    const expected = (rawSessions as any[]).map((s) => ({
      ...s,
      title: (asinTitleMap as Record<string, string>)[s.asin] ?? s.asin,
    }))
    expect(result).toEqual(expected)
  })
})

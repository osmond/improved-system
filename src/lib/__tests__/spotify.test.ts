import { describe, it, expect, vi } from 'vitest'
import { getSpotifyNowPlaying, setSpotifyAccessToken } from '../spotify'

describe('getSpotifyNowPlaying', () => {
  it('returns null when fetch rejects', async () => {
    setSpotifyAccessToken('token')

    const fetchSpy = vi
      .spyOn(globalThis, 'fetch')
      .mockRejectedValue(new Error('fail'))

    const result = await getSpotifyNowPlaying()

    expect(fetchSpy).toHaveBeenCalled()
    expect(result).toBeNull()
    fetchSpy.mockRestore()
  })
})

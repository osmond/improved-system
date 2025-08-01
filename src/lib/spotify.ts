export interface SpotifyTrack {
  id: string
  name: string
  artists: string
  uri: string
}

let accessToken: string | null = null
let tokenExpiry = 0

async function refreshAccessToken(): Promise<string> {
  if (process.env.SPOTIFY_ACCESS_TOKEN) {
    accessToken = process.env.SPOTIFY_ACCESS_TOKEN
    tokenExpiry = Date.now() + 3600_000
    return accessToken
  }

  const refresh = process.env.SPOTIFY_REFRESH_TOKEN
  const id = process.env.SPOTIFY_CLIENT_ID
  const secret = process.env.SPOTIFY_CLIENT_SECRET

  if (!refresh || !id || !secret) {
    accessToken = 'mock-token'
    tokenExpiry = Date.now() + 3600_000
    return accessToken
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization:
        'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refresh,
    }),
  })
  const data = (await res.json()) as { access_token: string; expires_in: number }
  accessToken = data.access_token
  tokenExpiry = Date.now() + data.expires_in * 1000
  return accessToken
}

async function ensureToken() {
  if (!accessToken || Date.now() >= tokenExpiry) {
    await refreshAccessToken()
  }
}

async function fetchSpotify<T>(endpoint: string): Promise<T> {
  await ensureToken()
  const res = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  if (!res.ok) throw new Error('Spotify request failed')
  return res.json() as Promise<T>
}

export async function getSpotifyRecentPlays(limit = 50) {
  type Response = { items: { track: any; played_at: string }[] }
  return fetchSpotify<Response>(
    `/me/player/recently-played?limit=${limit}`,
  )
}

export async function getSpotifyNowPlaying() {
  try {
    return fetchSpotify<any>('/me/player/currently-playing')
  } catch {
    return null
  }
}

export async function getAudioFeatures(trackId: string) {
  return fetchSpotify<any>(`/audio-features/${trackId}`)
}

export function setSpotifyAccessToken(token: string, expiresIn = 3600) {
  accessToken = token
  tokenExpiry = Date.now() + expiresIn * 1000
}

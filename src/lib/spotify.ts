export interface SpotifyTrack {
  id: string
  name: string
  artists: string
  uri: string
}

export interface SpotifyArtist {
  name: string
}

export interface SpotifyImage {
  url: string
}

export interface SpotifyTrackItem {
  id: string
  name: string
  artists: SpotifyArtist[]
  uri: string
  album?: {
    images?: SpotifyImage[]
  }
}

export interface SpotifyRecentPlay {
  track: SpotifyTrackItem
  played_at: string
}

export interface SpotifyNowPlaying {
  item: SpotifyTrackItem | null
}

let accessToken: string | null = null
let tokenExpiry = 0

async function refreshAccessToken(): Promise<string> {
  const access = import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN
  if (access) {
    accessToken = access
    tokenExpiry = Date.now() + 3600_000
    return accessToken
  }

  const refresh = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN
  const id = import.meta.env.VITE_SPOTIFY_CLIENT_ID
  const secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET

  if (!refresh || !id || !secret) {
    accessToken = 'mock-token'
    tokenExpiry = Date.now() + 3600_000
    return accessToken
  }

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + btoa(`${id}:${secret}`),
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

export async function getSpotifyRecentPlays(
  limit = 50,
): Promise<{ items: SpotifyRecentPlay[] }> {
  return fetchSpotify<{ items: SpotifyRecentPlay[] }>(
    `/me/player/recently-played?limit=${limit}`,
  )
}

export async function getSpotifyNowPlaying(): Promise<SpotifyNowPlaying | null> {
  try {
    return await fetchSpotify<SpotifyNowPlaying>('/me/player/currently-playing')
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

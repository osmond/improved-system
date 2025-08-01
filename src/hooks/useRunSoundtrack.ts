import { useEffect, useState } from 'react'
import { getLatestRun, type RunWindow } from '@/lib/api'
import {
  getSpotifyRecentPlays,
  getSpotifyNowPlaying,
  getAudioFeatures,
  type SpotifyTrack,
} from '@/lib/spotify'

export interface RunTrack extends SpotifyTrack {
  playCount: number
  tempo?: number | null
}

export interface RunSoundtrackState {
  window: RunWindow
  nowPlaying: any | null
  topTracks: RunTrack[]
}

export default function useRunSoundtrack(): RunSoundtrackState | null {
  const [state, setState] = useState<RunSoundtrackState | null>(null)

  useEffect(() => {
    let active = true
    async function fetchData() {
      const window = await getLatestRun()
      const [recent, now] = await Promise.all([
        getSpotifyRecentPlays(),
        getSpotifyNowPlaying(),
      ])
      const start = new Date(window.start).getTime()
      const end = new Date(window.end).getTime()
      const plays = recent.items.filter((p: any) => {
        const t = new Date(p.played_at).getTime()
        return t >= start && t <= end
      })
      const counts: Record<string, { track: any; count: number }> = {}
      plays.forEach((p: any) => {
        const id = p.track.id
        if (!counts[id]) counts[id] = { track: p.track, count: 0 }
        counts[id].count++
      })
      const top = Object.values(counts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 5)

      const withFeatures: RunTrack[] = []
      for (const item of top) {
        let tempo: number | null = null
        try {
          const features = await getAudioFeatures(item.track.id)
          tempo = features?.tempo ?? null
        } catch {}
        withFeatures.push({
          id: item.track.id,
          name: item.track.name,
          artists: item.track.artists.map((a: any) => a.name).join(', '),
          uri: item.track.uri,
          playCount: item.count,
          tempo,
        })
      }

      if (active) {
        setState({ window, nowPlaying: now?.item ?? null, topTracks: withFeatures })
      }
    }
    fetchData()
    return () => {
      active = false
    }
  }, [])

  return state
}

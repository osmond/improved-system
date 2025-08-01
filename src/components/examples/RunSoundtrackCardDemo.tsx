'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Track {
  id: string
  name: string
  artists: string
  playCount: number
  thumbnail?: string
}

interface DemoData {
  nowPlaying: {
    item: {
      name: string
      artists: { name: string }[]
      duration_ms: number
      album: { images: { url: string }[] }
    }
    progress_ms: number
  } | null
  topTracks: Track[]
}

const data: DemoData = {
  nowPlaying: {
    item: {
      name: 'Song A',
      artists: [{ name: 'Artist' }],
      duration_ms: 240000,
      album: { images: [{ url: 'https://via.placeholder.com/80' }] },
    },
    progress_ms: 90000,
  },
  topTracks: [
    {
      id: '1',
      name: 'Song A',
      artists: 'Artist',
      playCount: 2,
      thumbnail: 'https://via.placeholder.com/40',
    },
    {
      id: '2',
      name: 'Song B',
      artists: 'Other',
      playCount: 1,
      thumbnail: 'https://via.placeholder.com/40',
    },
    {
      id: '3',
      name: 'Song C',
      artists: 'Another',
      playCount: 1,
      thumbnail: 'https://via.placeholder.com/40',
    },
  ],
}

export default function RunSoundtrackCardDemo() {
  const maxPlays = Math.max(...data.topTracks.map((t) => t.playCount), 1)
  const playbackPercent = Math.round(
    (data.nowPlaying!.progress_ms / data.nowPlaying!.item.duration_ms) * 100,
  )

  function formatMs(ms: number) {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <Card className="max-w-xl rounded-2xl bg-white border border-gray-200 shadow-md p-6 flex flex-col">
      <CardHeader className="flex items-center justify-between p-0 mb-4">
        <CardTitle className="text-2xl font-bold leading-tight">Run Soundtrack</CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex flex-col gap-6">
        {data.nowPlaying && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-sm">
              <img
                src={data.nowPlaying.item.album.images[0].url}
                alt={`Album art for ${data.nowPlaying.item.name}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-green-600">Now Playing</p>
                <h3 className="mt-1 text-lg font-semibold">{data.nowPlaying.item.name}</h3>
                <p className="text-sm text-gray-700">
                  {data.nowPlaying.item.artists.map((a) => a.name).join(', ')}
                </p>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>0:00 / {formatMs(data.nowPlaying.item.duration_ms)}</span>
                </div>
                <div className="mt-1 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${playbackPercent}%`, background: 'linear-gradient(90deg,#1DB954,#1ED760)' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold">Top Tracks</h4>
            <span className="text-sm text-gray-500">Recent</span>
          </div>
          <ol className="mt-3 space-y-2">
            {data.topTracks.map((t, i) => {
              const widthPct = Math.round((t.playCount / maxPlays) * 100)
              return (
                <li key={t.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium truncate">
                        {i + 1}. {t.name} – {t.artists}
                      </div>
                      <div className="text-xs text-gray-500">({t.playCount}x)</div>
                    </div>
                    <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${widthPct}%`, backgroundColor: '#1DB954' }}
                      />
                    </div>
                  </div>
                  <div className="w-10 h-10 flex-shrink-0 rounded-md overflow-hidden">
                    <img
                      src={t.thumbnail}
                      alt={`Artwork for ${t.name}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

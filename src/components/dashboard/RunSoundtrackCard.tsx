import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import useRunSoundtrack from '@/hooks/useRunSoundtrack'
import { minutesSince } from '@/lib/utils'

function WaveformBackdrop() {
  return (
    <svg
      className="absolute inset-0 w-full h-full -z-10 opacity-5"
      viewBox="0 0 100 10"
      preserveAspectRatio="none"
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        points="0,5 5,5 8,2 12,8 16,5 20,5 24,2 28,8 32,4 36,6 40,2 44,8 48,5 52,5 56,2 60,8 64,5 68,5 72,2 76,8 80,5 84,5 88,2 92,8 96,5 100,5"
      />
    </svg>
  )
}

export default function RunSoundtrackCard() {
  const data = useRunSoundtrack()

  if (!data) return <Skeleton className="h-40" />

  const maxPlays = Math.max(...data.topTracks.map((t) => t.playCount), 1)

  const progressPct = data.nowPlaying?.progress_ms && data.nowPlaying.item?.duration_ms
    ? Math.min(
        100,
        Math.round((data.nowPlaying.progress_ms / data.nowPlaying.item.duration_ms) * 100),
      )
    : 0

  function formatMs(ms: number) {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <Card className="text-spotify-primary">
      <CardHeader className="flex items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-4">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          <CardTitle className="font-slab text-2xl font-bold">Run Soundtrack</CardTitle>
        </div>
        {data.nowPlaying && (
          <span className="flex items-center gap-2 text-sm text-green-600">
            <span
              className="w-2 h-2 rounded-full bg-current animate-pulse"
              aria-label="listening"
            />
            Live
          </span>
        )}
      </CardHeader>
      <CardContent className="space-y-6 p-6 pt-0">
        {data.nowPlaying && (
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden shadow-sm">
              {data.nowPlaying.item?.album?.images?.[0]?.url && (
                <img
                  src={data.nowPlaying.item.album.images[0].url}
                  alt={`Album art for ${data.nowPlaying.item.name}`}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex-grow flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase font-semibold text-green-600">Now Playing</p>
                <h3 className="mt-1 text-lg font-medium">
                  {data.nowPlaying.item.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {data.nowPlaying.item.artists.map((a: any) => a.name).join(', ')}
                </p>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{minutesSince(data.window.start)}m ago</span>
                  {data.nowPlaying.progress_ms && data.nowPlaying.item?.duration_ms && (
                    <span>
                      {formatMs(data.nowPlaying.progress_ms)} /{' '}
                      {formatMs(data.nowPlaying.item.duration_ms)}
                    </span>
                  )}
                </div>
                <div className="mt-1 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${progressPct}%`,
                      background: 'linear-gradient(90deg,#1DB954,#1ED760)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <h4 className="text-base font-semibold">Top Tracks</h4>
            <span className="text-sm text-muted-foreground">Recent</span>
          </div>
          <ol className="mt-4 space-y-2">
            {data.topTracks.map((t, i) => {
              const widthPct = Math.round((t.playCount / maxPlays) * 100)
              return (
                <li key={t.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-medium truncate">
                        {i + 1}. {t.name} – {t.artists}
                      </div>
                      <div className="text-xs text-muted-foreground">({t.playCount}x)</div>
                    </div>
                    <div className="mt-1 h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-spotify-primary"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                  {t.thumbnail && (
                    <div className="w-10 h-10 flex-shrink-0 rounded-md overflow-hidden">
                      <img
                        src={t.thumbnail}
                        alt={`Artwork for ${t.name}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

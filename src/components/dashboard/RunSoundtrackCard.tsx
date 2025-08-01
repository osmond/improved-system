import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import useRunSoundtrack from '@/hooks/useRunSoundtrack'

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

  if (!data) return <Skeleton className="h-32" />

  return (
    <Card className="text-spotify-primary">
      <CardHeader className="flex items-center gap-2 p-3">
        <svg
          className="w-4 h-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        <CardTitle className="font-slab font-bold text-lg">Run Soundtrack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-3 pt-0">
        {data.nowPlaying && (
          <div className="relative pb-2 mb-2 border-b text-sm">
            <WaveformBackdrop />
            <p className="font-medium">Now Playing</p>
            <p>
              {data.nowPlaying.item.name} –{' '}
              {data.nowPlaying.item.artists.map((a: any) => a.name).join(', ')}
            </p>
          </div>
        )}
        <div>
          <p className="font-medium text-sm">Top Tracks</p>
          <ol className="mt-1 space-y-1 text-sm list-decimal list-inside">
            {data.topTracks.map((t) => (
              <li key={t.id} className="relative flex justify-between">
                <span>{t.name} – {t.artists}</span>
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {t.playCount}
                </Badge>
                <WaveformBackdrop />
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

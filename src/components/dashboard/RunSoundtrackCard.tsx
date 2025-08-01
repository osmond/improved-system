import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import useRunSoundtrack from '@/hooks/useRunSoundtrack'

export default function RunSoundtrackCard() {
  const data = useRunSoundtrack()

  if (!data) return <Skeleton className="h-32" />

  return (
    <Card className="bg-spotify-primary text-spotify-foreground">
      <CardHeader>
        <CardTitle>Run Soundtrack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.nowPlaying && (
          <div className="text-sm">
            <p className="font-medium">Now Playing</p>
            <p>{data.nowPlaying.item.name} –{' '}{data.nowPlaying.item.artists.map((a: any) => a.name).join(', ')}</p>
          </div>
        )}
        <div>
          <p className="font-medium text-sm">Top Tracks</p>
          <ol className="mt-1 space-y-1 text-sm list-decimal list-inside">
            {data.topTracks.map((t) => (
              <li key={t.id}>
                {t.name} – {t.artists} ({t.playCount}x)
              </li>
            ))}
          </ol>
        </div>
      </CardContent>
    </Card>
  )
}

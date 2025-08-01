'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Track {
  id: string
  name: string
  artists: string
  playCount: number
}

interface DemoData {
  nowPlaying: { item: { name: string; artists: { name: string }[] } } | null
  topTracks: Track[]
}

const data: DemoData = {
  nowPlaying: { item: { name: 'Song A', artists: [{ name: 'Artist' }] } },
  topTracks: [
    { id: '1', name: 'Song A', artists: 'Artist', playCount: 2 },
    { id: '2', name: 'Song B', artists: 'Other', playCount: 1 },
    { id: '3', name: 'Song C', artists: 'Another', playCount: 1 },
  ],
}

export default function RunSoundtrackCardDemo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Run Soundtrack</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {data.nowPlaying && (
          <div className="text-sm">
            <p className="font-medium">Now Playing</p>
            <p>
              {data.nowPlaying.item.name} –{' '}
              {data.nowPlaying.item.artists.map((a) => a.name).join(', ')}
            </p>
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

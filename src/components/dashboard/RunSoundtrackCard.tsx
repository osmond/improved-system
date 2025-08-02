import { Skeleton } from '@/components/ui/skeleton'
import useRunSoundtrack from '@/hooks/useRunSoundtrack'
import { minutesSince } from '@/lib/utils'

export default function RunSoundtrackCard() {
  const data = useRunSoundtrack()

  if (!data) return <Skeleton className="h-28 max-w-sm rounded-xl" />

  const progressPct =
    data.nowPlaying?.progress_ms && data.nowPlaying.item?.duration_ms
      ? Math.min(
          100,
          Math.round(
            (data.nowPlaying.progress_ms / data.nowPlaying.item.duration_ms) * 100,
          ),
        )
      : 0

  function formatMs(ms: number) {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    return `${m}:${String(s).padStart(2, '0')}`
  }

  return (
    <div className="max-w-sm rounded-xl bg-white border border-gray-200 shadow-sm p-4 flex items-start gap-3">
      {data.nowPlaying ? (
        <>
          <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
            {data.nowPlaying.item?.album?.images?.[0]?.url && (
              <img
                src={data.nowPlaying.item.album.images[0].url}
                alt={`Album art for ${data.nowPlaying.item.name}`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div className="flex-grow">
            <p
              className="text-xs font-semibold uppercase"
              style={{ color: '#1DB954' }}
            >
              Now Playing
            </p>
            <h3 className="mt-1 text-lg font-semibold leading-tight">
              {data.nowPlaying.item.name}
            </h3>
            <p className="text-xs text-gray-600">
              {data.nowPlaying.item.artists.map((a: any) => a.name).join(', ')}
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-[10px] text-gray-500">
                <span>{minutesSince(data.window.start)}m ago</span>
                {data.nowPlaying.progress_ms && data.nowPlaying.item?.duration_ms && (
                  <span>
                    {formatMs(data.nowPlaying.progress_ms)} /{' '}
                    {formatMs(data.nowPlaying.item.duration_ms)}
                  </span>
                )}
              </div>
              <div className="mt-1 w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                <div
                  role="progressbar"
                  className="h-full rounded-full"
                  style={{ width: `${progressPct}%`, backgroundColor: '#1DB954' }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-20 text-sm text-gray-500 w-full">
          Not currently listening
        </div>
      )}
    </div>
  )
}


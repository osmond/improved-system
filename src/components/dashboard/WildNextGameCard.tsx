import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Tv } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format, parseISO, formatDistanceToNow } from 'date-fns'
import useWildSchedule from '@/hooks/useWildSchedule'

export default function WildNextGameCard() {
  const data = useWildSchedule(1)

  if (!data) {
    return <Skeleton className="h-32" />
  }

  const game = data[0]
  const date = parseISO(game.gameDate)

  return (
    <Card className="max-w-md text-wild-primary bg-white/80 backdrop-blur-sm border border-gray-200 shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center ring-1 ring-gray-200">
              <span className="text-xl font-bold text-wild-secondary">W</span>
            </div>
          </div>
          <div className="flex-grow flex flex-col">
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <p className="text-sm text-muted-foreground">Next Game</p>
                <h2 className="mt-1 text-2xl font-semibold leading-tight text-wild-secondary">
                  Wild vs <span className="font-normal text-foreground">{game.opponent}</span>
                </h2>
              </div>
              <div className="flex flex-col items-end space-y-1 text-right">
                <p className="text-sm text-muted-foreground">{format(date, 'PPp')}</p>
                <Badge className="bg-wild-wheat text-wild-primary px-3 py-1">{game.home ? 'Home' : 'Away'}</Badge>
              </div>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="mt-5">
          <a
            href={game.watchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'w-full flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none disabled:opacity-50',
              'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
              'py-2.5 px-6',
            )}
          >
            <Tv className="w-5 h-5" />
            Game Details
          </a>
        </div>
      </CardContent>
    </Card>
  )
}

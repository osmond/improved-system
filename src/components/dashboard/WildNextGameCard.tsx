import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
          <div className="flex-grow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Next Game</p>
                <h2 className="mt-1 text-2xl font-semibold text-wild-secondary">
                  Wild vs <span className="font-normal text-foreground">{game.opponent}</span>
                </h2>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">{format(date, 'PPp')}</p>
                <Badge className="bg-wild-wheat text-wild-primary">{game.home ? 'Home' : 'Away'}</Badge>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              {formatDistanceToNow(date, { addSuffix: true })}
            </div>
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button className="flex-1 bg-wild-secondary hover:bg-wild-secondary/90 text-white" size="sm">
            Add to Calendar
          </Button>
          <Button variant="outline" className="flex-1" size="sm">
            Game Details
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

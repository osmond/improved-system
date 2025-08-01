import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { format, parseISO } from 'date-fns'
import useWildSchedule from '@/hooks/useWildSchedule'

export default function WildNextGameCard() {
  const data = useWildSchedule(1)

  if (!data) {
    return <Skeleton className="h-24" />
  }

  const game = data[0]
  const date = parseISO(game.gameDate)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Next Game</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{format(date, 'PPpp')}</p>
        <p className="font-semibold">
          {game.opponent} {game.home ? 'at home' : 'away'}
        </p>
      </CardContent>
    </Card>
  )
}

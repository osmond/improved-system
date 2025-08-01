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
    <Card className="text-wild-primary">
      <CardHeader className="flex items-center gap-2">
        <svg
          className="w-4 h-4 text-wild-secondary"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 20L4.5 4h2L12 16l5.5-12h2L22 20h-2l-3.5-10.5L13 20h-2l-3.5-10.5L4 20H2z" />
        </svg>
        <CardTitle className="text-wild-secondary">Next Game</CardTitle>
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

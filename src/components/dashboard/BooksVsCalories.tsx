import React from 'react'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import useReadingProgress from '@/hooks/useReadingProgress'
import { useGarminData } from '@/hooks/useGarminData'
import useUserGoals from '@/hooks/useUserGoals'

function ProgressBar({ value, max, testId }: { value: number; max: number; testId: string }) {
  const pct = max === 0 ? 0 : Math.max(Math.min((value / max) * 100, 100), 0)
  return (
    <div className="h-2 w-full rounded bg-muted">
      <div
        data-testid={testId}
        className="h-2 rounded bg-primary"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

export default function BooksVsCalories() {
  const reading = useReadingProgress()
  const garmin = useGarminData()
  const { calorieGoal } = useUserGoals()

  if (!reading || !garmin) return <Skeleton className="h-8" />

  const unread = Math.max(reading.readingGoal - reading.pagesRead, 0)
  const unburned = Math.max(calorieGoal - garmin.calories, 0)

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card
            className="flex gap-2 p-4"
            tabIndex={0}
            role="img"
            aria-label="Books vs Calories"
          >
            <ProgressBar value={unread} max={reading.readingGoal} testId="pages-bar" />
            <ProgressBar value={unburned} max={calorieGoal} testId="calorie-bar" />
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          {`Pages left: ${unread} / Calories to burn: ${unburned}.`}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

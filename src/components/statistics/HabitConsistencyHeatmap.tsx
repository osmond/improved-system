"use client"

import ChartCard from "@/components/dashboard/ChartCard"
import { ChartContainer } from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import useTrainingConsistency from "@/hooks/useTrainingConsistency"

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function HabitConsistencyHeatmap() {
  const data = useTrainingConsistency()

  if (!data) return <Skeleton className="h-64" />

  const { heatmap } = data

  const grid = Array.from({ length: 24 }, () =>
    Array.from({ length: 7 }, () => ({ count: 0 })),
  )
  let max = 0
  heatmap.forEach((c) => {
    grid[c.hour][c.day] = c
    if (c.count > max) max = c.count
  })

  return (
    <ChartCard
      title="Habit Consistency"
      description="Session count by weekday and hour"
    >
      <ChartContainer config={{}} className="h-64 md:h-80 lg:h-96">
        <div className="grid gap-px text-center text-[10px]">
          <div className="grid grid-cols-7 text-xs font-medium">
            {dayLabels.map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>
          {grid.map((row, hour) => (
            <div key={hour} className="grid grid-cols-7">
              {row.map((cell, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center border bg-accent text-accent-foreground h-4"
                  style={{ opacity: max ? cell.count / max : 0 }}
                />
              ))}
            </div>
          ))}
        </div>
      </ChartContainer>
    </ChartCard>
  )
}


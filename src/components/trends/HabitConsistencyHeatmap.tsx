"use client"

import ChartCard from "@/components/dashboard/ChartCard"
import { ChartContainer } from "@/ui/chart"
import { Button } from "@/ui/button"
import { Link } from "react-router-dom"
import type { TrainingHeatmapCell } from "@/hooks/useTrainingConsistency"

function getHourLabel(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`
}

const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

export default function HabitConsistencyHeatmap({
  heatmap,
  timeframe,
}: {
  heatmap: TrainingHeatmapCell[]
  timeframe: string
}) {

  const grid = Array.from({ length: 24 }, () =>
    Array.from({ length: 7 }, () => ({ count: 0 })),
  )
  let max = 0
  heatmap.forEach((c) => {
    grid[c.hour][c.day] = c
    if (c.count > max) max = c.count
  })

  if (max === 0) {
    return (
      <ChartCard
        title="Habit Consistency"
        description={`Session count by weekday and hour${
          timeframe !== 'all' ? ` (last ${timeframe})` : ''
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-4 h-64 md:h-80 lg:h-96 text-sm text-muted-foreground text-center">
          <p>No session data yet.</p>
          <Button asChild size="sm">
            <Link to="/dashboard">Log a session</Link>
          </Button>
        </div>
      </ChartCard>
    )
  }

  return (
    <ChartCard
      title="Habit Consistency"
      description={`Session count by weekday and hour${
        timeframe !== 'all' ? ` (last ${timeframe})` : ''
      }`}
    >
      <ChartContainer config={{}} className="h-64 md:h-80 lg:h-96">
        <div className="flex h-full flex-col">
          <div className="grid flex-1 gap-px text-center text-[10px]">
            <div className="grid grid-cols-8 text-xs font-medium">
              <div />
              {dayLabels.map((d) => (
                <div key={d}>{d}</div>
              ))}
            </div>
            {grid.map((row, hour) => (
              <div key={hour} className="grid grid-cols-8">
                <div className="pr-1 text-right text-xs text-muted-foreground">
                  {getHourLabel(hour)}
                </div>
                {row.map((cell, idx) => {
                  const ratio = max ? cell.count / max : 0
                  const color = `hsl(var(--accent) / ${ratio})`
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-center border text-accent-foreground h-4"
                      style={{ backgroundColor: color }}
                      tabIndex={0}
                      aria-label={`${dayLabels[idx]} hour ${hour}: ${cell.count} sessions`}
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center text-[10px] text-muted-foreground">
            <span className="mr-2">0</span>
            <div
              className="h-2 flex-1 rounded"
              style={{
                background: "linear-gradient(to right, hsl(var(--accent) / 0), hsl(var(--accent)))",
              }}
            />
            <span className="ml-2">{max}</span>
          </div>
        </div>
      </ChartContainer>
    </ChartCard>
  )
}


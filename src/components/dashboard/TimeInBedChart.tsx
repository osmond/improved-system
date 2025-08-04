import { useEffect, useMemo, useState } from 'react'
import {
  ChartContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  CartesianGrid,
  YAxis,
  ReferenceLine,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
} from '@/ui/chart'
import ChartCard from './ChartCard'
import { Skeleton } from '@/ui/skeleton'
import type { ChartConfig } from '@/ui/chart'
import type { SleepSession } from '@/lib/api'
import { getSleepSessions } from '@/lib/api'

export default function TimeInBedChart() {
  const [data, setData] = useState<SleepSession[] | null>(null)

  useEffect(() => {
    getSleepSessions().then((sessions) =>
      setData([...sessions].sort((a, b) => a.date.localeCompare(b.date)))
    )
  }, [])

  const dataWithAvg = useMemo(() => {
    if (!data) return []
    return data.map((d, idx) => {
      const start = Math.max(0, idx - 6)
      const slice = data.slice(start, idx + 1)
      const avg = slice.reduce((sum, val) => sum + val.timeInBed, 0) / slice.length
      return { ...d, avg }
    })
  }, [data])

  if (!data) return <Skeleton className="h-64" />

  const config = {
    timeInBed: { label: 'Hours', color: 'var(--chart-1)' },
    avg: { label: '7d Avg', color: 'var(--chart-2)' },
    goal: { label: 'Goal', color: 'var(--chart-3)' },
  } satisfies ChartConfig

  return (
    <ChartCard title="Time in Bed" description="Hours spent in bed each night">
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <AreaChart data={dataWithAvg} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <YAxis />
          <ReferenceLine y={8} stroke={config.goal.color} strokeDasharray="4 4" />
          <ChartTooltip
            content={
              <ChartTooltipContent
                nameKey="timeInBed"
                formatter={(v) => `${v} hr`}
                labelFormatter={(d) => new Date(d).toLocaleDateString()}
              />
            }
          />
          <Area
            type="monotone"
            dataKey="timeInBed"
            stroke={config.timeInBed.color}
            fill={config.timeInBed.color}
            fillOpacity={0.2}
          />
          <Line type="monotone" dataKey="avg" stroke={config.avg.color} dot={false} />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

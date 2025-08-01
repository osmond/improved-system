import { useEffect, useState } from 'react'
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  YAxis,
  Tooltip as ChartTooltip,
} from '@/components/ui/chart'
import ChartCard from './ChartCard'
import { Skeleton } from '@/components/ui/skeleton'
import type { ChartConfig } from '@/components/ui/chart'
import type { SleepSession } from '@/lib/api'
import { getSleepSessions } from '@/lib/api'

export default function TimeInBedChart() {
  const [data, setData] = useState<SleepSession[] | null>(null)

  useEffect(() => {
    getSleepSessions().then(setData)
  }, [])

  if (!data) return <Skeleton className="h-64" />

  const config = {
    timeInBed: { label: 'Hours', color: 'var(--chart-1)' },
  } satisfies ChartConfig

  return (
    <ChartCard title="Time in Bed" description="Hours spent in bed each night">
      <ChartContainer config={config} className="h-64">
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toLocaleDateString()} />
          <YAxis />
          <ChartTooltip />
          <Bar dataKey="timeInBed" fill={config.timeInBed.color} radius={2} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

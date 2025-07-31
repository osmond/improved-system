import { ChartContainer } from '@/components/ui/chart'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from '@/components/ui/chart'

export interface WeekdayMileage {
  day: string
  pct: number
}

interface AverageDailyMileageChartProps {
  data: WeekdayMileage[]
  maxPct: number
}

export function AverageDailyMileageChart({ data, maxPct }: AverageDailyMileageChartProps) {
  const config = { pct: { color: 'var(--chart-9)' } }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Daily Mileage by Day'
    >
      <RadarChart data={data}>
        <PolarGrid stroke='var(--grid-line)' />
        <PolarAngleAxis
          dataKey='day'
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxPct]}
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
        />
        <Radar dataKey='pct' fill='var(--chart-9)' fillOpacity={0.6} />
      </RadarChart>
    </ChartContainer>
  )
}

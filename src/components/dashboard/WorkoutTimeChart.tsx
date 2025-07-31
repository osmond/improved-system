import { ChartContainer } from '@/components/ui/chart-container'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from '@/components/ui/chart'

export interface HourActivity {
  hour: number
  pct: number
}

interface WorkoutTimeChartProps {
  data: HourActivity[]
  maxPct: number
}

export function WorkoutTimeChart({ data, maxPct }: WorkoutTimeChartProps) {
  const config = { pct: { color: 'var(--chart-8)' } }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Workout Activity by Time'
    >
      <RadarChart data={data}>
        <PolarGrid stroke='var(--grid-line)' />
        <PolarAngleAxis
          dataKey='hour'
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
        />
        <PolarRadiusAxis
          angle={90}
          domain={[0, maxPct]}
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
        />
        <Radar dataKey='pct' fill='var(--chart-8)' fillOpacity={0.6} />
      </RadarChart>
    </ChartContainer>
  )
}

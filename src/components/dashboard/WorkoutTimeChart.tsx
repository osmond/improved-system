import {
  ChartContainer,
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
  const config = { pct: { color: 'hsl(var(--chart-8))' } }
  return (
    <ChartContainer
      config={config}
      className='h-60'
      title='Workout Activity by Time'
    >
      <RadarChart data={data}>
        <PolarGrid stroke='hsl(var(--muted))' />
        <PolarAngleAxis dataKey='hour' />
        <PolarRadiusAxis angle={90} domain={[0, maxPct]} />
        <Radar dataKey='pct' fill='hsl(var(--chart-8))' fillOpacity={0.6} />
      </RadarChart>
    </ChartContainer>
  )
}

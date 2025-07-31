import {
  ChartContainer,
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
  const config = { pct: { color: 'hsl(var(--chart-9))' } }
  return (
    <ChartContainer
      config={config}
      className='h-60'
      title='Daily Mileage by Day'
    >
      <RadarChart data={data}>
        <PolarGrid stroke='hsl(var(--muted))' />
        <PolarAngleAxis dataKey='day' />
        <PolarRadiusAxis angle={90} domain={[0, maxPct]} />
        <Radar dataKey='pct' fill='hsl(var(--chart-9))' fillOpacity={0.6} />
      </RadarChart>
    </ChartContainer>
  )
}

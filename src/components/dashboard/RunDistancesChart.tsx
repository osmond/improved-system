import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from '@/components/ui/chart'

export interface DistanceBucket {
  label: string
  count: number
}

interface RunDistancesChartProps {
  data: DistanceBucket[]
}

export function RunDistancesChart({ data }: RunDistancesChartProps) {
  const config = { count: { color: 'hsl(var(--chart-10))' } }
  return (
    <ChartContainer config={config} className='h-60'>
      <BarChart layout='vertical' data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type='number' hide />
        <YAxis dataKey='label' type='category' />
        <Bar dataKey='count' fill='hsl(var(--chart-10))' />
      </BarChart>
    </ChartContainer>
  )
}

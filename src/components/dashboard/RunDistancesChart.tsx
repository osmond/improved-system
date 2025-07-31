import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from '@/components/ui/chart'
import ChartCard from './ChartCard'

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
    <ChartCard title='Run Distances' className='md:col-span-2'>
      <ChartContainer config={config} className='h-60'>
      <BarChart layout='vertical' data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type='number' hide />
        <YAxis dataKey='label' type='category' />
        <Tooltip />
        <Bar dataKey='count' fill='hsl(var(--chart-10))' radius={[0,4,4,0]} />
      </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

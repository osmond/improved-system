import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from '@/components/ui/chart'

export interface TempBucket {
  label: string
  count: number
}

interface TemperatureChartProps {
  data: TempBucket[]
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  const config = { count: { color: 'hsl(var(--chart-5))' } }
  return (
    <ChartContainer
      config={config}
      className='h-60'
      title='Temperature'
    >
      <BarChart layout='vertical' data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type='number' hide />
        <YAxis dataKey='label' type='category' />
        <Tooltip />
        <Bar dataKey='count' fill='hsl(var(--chart-5))' radius={[0,4,4,0]} />
      </BarChart>
    </ChartContainer>
  )
}

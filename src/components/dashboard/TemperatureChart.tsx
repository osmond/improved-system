import { ChartContainer } from '@/components/ui/chart'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export interface TempBucket {
  label: string
  count: number
}

interface TemperatureChartProps {
  data: TempBucket[]
}

export function TemperatureChart({ data }: TemperatureChartProps) {
  const config = { count: { color: 'var(--chart-5)' } }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Temperature'
    >
      <BarChart layout='vertical' data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type='number' hide />
        <YAxis
          dataKey='label'
          type='category'
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <Bar dataKey='count' fill='var(--chart-5)' radius={[0,4,4,0]} />
      </BarChart>
    </ChartContainer>
  )
}

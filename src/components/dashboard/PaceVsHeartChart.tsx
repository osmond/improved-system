import { ChartContainer } from '@/components/ui/chart'
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export interface PaceHeartPoint {
  pace: number
  heartRate: number
}

interface PaceVsHeartChartProps {
  data: PaceHeartPoint[]
}

export function PaceVsHeartChart({ data }: PaceVsHeartChartProps) {
  const config = {
    value: { color: 'var(--chart-4)' },
  }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Pace vs Heart Rate'
    >
      <ScatterChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid stroke='var(--grid-line)' />
        <XAxis
          dataKey='pace'
          type='number'
          reversed
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <YAxis
          dataKey='heartRate'
          type='number'
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <Scatter fill='var(--chart-4)' />
      </ScatterChart>
    </ChartContainer>
  )
}

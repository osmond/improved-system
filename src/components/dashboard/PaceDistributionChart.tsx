import { ChartContainer } from '@/components/ui/chart-container'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
} from '@/components/ui/chart'

export interface PaceDistributionBin {
  bin: string
  upper: number
  lower: number
}

interface PaceDistributionChartProps {
  data: PaceDistributionBin[]
}

export function PaceDistributionChart({ data }: PaceDistributionChartProps) {
  const config = {
    upper: { color: 'var(--chart-primary)' },
    lower: { color: 'var(--chart-primary)' },
  }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Pace Distribution'
    >
      <AreaChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid stroke='var(--grid-line)' strokeDasharray='3 3' />
        <XAxis
          dataKey='bin'
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <YAxis hide />
        <ReferenceLine y={0} strokeDasharray='3 3' stroke='var(--axis-line)' />
        <Area dataKey='upper' fill='var(--chart-primary)' stroke='none' />
        <Area dataKey='lower' fill='var(--chart-primary)' stroke='none' />
      </AreaChart>
    </ChartContainer>
  )
}

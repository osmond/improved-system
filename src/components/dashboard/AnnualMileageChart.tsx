import { ChartContainer } from '@/components/ui/chart-container'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export interface AnnualMileage {
  year: number
  totalMiles: number
}

interface AnnualMileageChartProps {
  data: AnnualMileage[]
}

export function AnnualMileageChart({ data }: AnnualMileageChartProps) {
  const config = { totalMiles: { color: 'var(--chart-7)' } }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Annual Mileage'
    >
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid stroke='var(--grid-line)' strokeDasharray='3 3' />
        <XAxis
          dataKey='year'
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: 'var(--tick-text)', fontSize: 10 }}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <Bar dataKey='totalMiles' fill='var(--chart-7)' />
      </BarChart>
    </ChartContainer>
  )
}

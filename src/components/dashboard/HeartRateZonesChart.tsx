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

export interface HeartRateZoneData {
  zone: string
  count: number
}

interface HeartRateZonesChartProps {
  data: HeartRateZoneData[]
}

export function HeartRateZonesChart({ data }: HeartRateZonesChartProps) {
  const config = {
    count: { color: 'var(--chart-2)' },
  }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Heart Rate Zones'
    >
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid stroke='var(--grid-line)' />
        <XAxis
          dataKey='zone'
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
        <Bar dataKey='count' fill='var(--chart-2)' radius={[4,4,0,0]} />
      </BarChart>
    </ChartContainer>
  )
}

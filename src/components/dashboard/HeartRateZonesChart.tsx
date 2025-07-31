import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from '@/components/ui/chart'
import ChartCard from './ChartCard'

export interface HeartRateZoneData {
  zone: string
  count: number
}

interface HeartRateZonesChartProps {
  data: HeartRateZoneData[]
}

export function HeartRateZonesChart({ data }: HeartRateZonesChartProps) {
  const config = {
    count: { color: 'hsl(var(--chart-2))' },
  }
  return (
    <ChartCard title='Heart Rate Zones' className='md:col-span-2'>
      <ChartContainer config={config} className='h-60'>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid stroke='hsl(var(--muted))' />
          <XAxis dataKey='zone' />
          <YAxis />
          <Tooltip />
          <Bar dataKey='count' fill='hsl(var(--chart-2))' radius={[4,4,0,0]} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

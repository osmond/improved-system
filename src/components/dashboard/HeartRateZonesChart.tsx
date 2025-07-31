import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
    count: { color: 'hsl(var(--chart-2))' },
  }
  return (
    <ChartContainer
      config={config}
      className='h-60'
      title='Heart Rate Zones'
    >
      <BarChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid stroke='hsl(var(--muted))' />
        <XAxis dataKey='zone' />
        <YAxis />
        <Tooltip />
        <Bar dataKey='count' fill='hsl(var(--chart-2))' radius={[4,4,0,0]} />
      </BarChart>
    </ChartContainer>
  )
}

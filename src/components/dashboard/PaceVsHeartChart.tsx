import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
    value: { color: 'hsl(var(--chart-4))' },
  }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Pace vs Heart Rate'
    >
      <ScatterChart data={data} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
        <CartesianGrid stroke='hsl(var(--muted))' />
        <XAxis dataKey='pace' type='number' reversed />
        <YAxis dataKey='heartRate' type='number' />
        <Tooltip />
        <Scatter fill='hsl(var(--chart-4))' />
      </ScatterChart>
    </ChartContainer>
  )
}

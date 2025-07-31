import {
  ChartContainer,
  PieChart,
  Pie,
  Tooltip,
} from '@/components/ui/chart'

export interface TreadmillOutdoor {
  outdoor: number
  treadmill: number
}

interface TreadmillOutdoorChartProps {
  data: TreadmillOutdoor
}

export function TreadmillOutdoorChart({ data }: TreadmillOutdoorChartProps) {
  const config = { value: { color: 'hsl(var(--chart-1))' } }
  const chartData = [
    { name: 'outdoor', value: data.outdoor, fill: 'hsl(var(--muted))' },
    { name: 'treadmill', value: data.treadmill, fill: 'hsl(var(--chart-1))' },
  ]
  return (
    <ChartContainer
      config={config}
      className='h-60'
      title='Treadmill vs Outdoor'
    >
      <PieChart>
        <Pie
          data={chartData}
          dataKey='value'
          nameKey='name'
          innerRadius={60}
          outerRadius={80}
          labelLine={false}
          label={({ name }) => name}
        />
        <Tooltip />
      </PieChart>
    </ChartContainer>
  )
}

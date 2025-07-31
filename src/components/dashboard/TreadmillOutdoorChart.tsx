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
    { name: 'outdoor', value: data.outdoor },
    { name: 'treadmill', value: data.treadmill },
  ]
  return (
    <ChartContainer config={config} className='h-60'>
      <PieChart>
        <Pie
          data={chartData}
          dataKey='value'
          nameKey='name'
          innerRadius={60}
          outerRadius={80}
          fill='hsl(var(--chart-1))'
          labelLine={false}
          label={({ name }) => name}
        />
        <Tooltip />
      </PieChart>
    </ChartContainer>
  )
}

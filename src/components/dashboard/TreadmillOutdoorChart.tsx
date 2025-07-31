import { ChartContainer } from '@/components/ui/chart-container'
import {
  PieChart,
  Pie,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export interface TreadmillOutdoor {
  outdoor: number
  treadmill: number
}

interface TreadmillOutdoorChartProps {
  data: TreadmillOutdoor
}

export function TreadmillOutdoorChart({ data }: TreadmillOutdoorChartProps) {
  const config = { value: { color: 'var(--chart-1)' } }
  const chartData = [
    { name: 'outdoor', value: data.outdoor, fill: 'hsl(var(--muted))' },
    { name: 'treadmill', value: data.treadmill, fill: 'var(--chart-1)' },
  ]
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
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
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
      </PieChart>
    </ChartContainer>
  )
}

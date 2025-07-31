import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from '@/components/ui/chart'
import { SunIcon, CloudIcon } from 'lucide-react'

export interface WeatherCondition {
  label: string
  count: number
}

interface WeatherConditionsChartProps {
  data: WeatherCondition[]
}

export function WeatherConditionsChart({ data }: WeatherConditionsChartProps) {
  const config = { count: { color: 'hsl(var(--chart-6))' } }
  return (
    <ChartContainer config={config} className='h-60'>
      <BarChart layout='vertical' data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type='number' hide />
        <YAxis dataKey='label' type='category' tickFormatter={(l) => l} />
        <Tooltip />
        <Bar dataKey='count' fill='hsl(var(--chart-6))' radius={[0,4,4,0]} />
      </BarChart>
    </ChartContainer>
  )
}

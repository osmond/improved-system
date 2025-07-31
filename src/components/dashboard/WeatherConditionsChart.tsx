import { ChartContainer } from '@/components/ui/chart-container'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { SunIcon, CloudIcon, CloudRainIcon, SnowflakeIcon } from 'lucide-react'
import * as React from 'react'

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Sunny: SunIcon,
  Cloudy: CloudIcon,
  Rain: CloudRainIcon,
  Snow: SnowflakeIcon,
}

function AxisTick({ x, y, payload }: any) {
  const Icon = ICONS[payload.value] || SunIcon
  return (
    <g transform={`translate(${x},${y})`}>
      <Icon className='h-3 w-3 translate-x-[-10px] text-[color:var(--tick-text)]' />
      <text x={0} y={0} dx={4} dy={4} textAnchor='start' fill='var(--tick-text)'>
        {payload.value}
      </text>
    </g>
  )
}

export interface WeatherCondition {
  label: string
  count: number
}

interface WeatherConditionsChartProps {
  data: WeatherCondition[]
}

export function WeatherConditionsChart({ data }: WeatherConditionsChartProps) {
  const config = { count: { color: 'var(--chart-6)' } }
  return (
    <ChartContainer
      config={config}
      className='h-60 md:col-span-2'
      title='Weather Conditions'
    >
      <BarChart layout='vertical' data={data} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <XAxis type='number' hide />
        <YAxis
          dataKey='label'
          type='category'
          tick={<AxisTick />}
          axisLine={{ stroke: 'var(--axis-line)' }}
          tickLine={false}
        />
        <ChartTooltip>
          <ChartTooltipContent />
        </ChartTooltip>
        <Bar dataKey='count' fill='var(--chart-6)' radius={[0,4,4,0]} />
      </BarChart>
    </ChartContainer>
  )
}

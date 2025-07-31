'use client'

import {
  ChartContainer,
  PieChart,
  Pie,
  Tooltip as ChartTooltip,
  ChartLegend,
} from '@/components/ui/chart'
import { Cell } from 'recharts'

export const description = 'A treadmill vs outdoor chart'

const chartData = [
  { name: 'Outdoor', value: 1254 },
  { name: 'Treadmill', value: 477 },
]

const chartConfig = {
  Outdoor: { label: 'Outdoor', color: 'var(--chart-5)' },
  Treadmill: { label: 'Treadmill', color: 'var(--chart-6)' },
} satisfies Record<string, unknown>

export default function TreadmillVsOutdoorExample() {
  return (
    <ChartContainer config={chartConfig} className='h-60' title='Treadmill vs Outdoor'>
      <PieChart width={200} height={160}>
        <ChartTooltip />
        <ChartLegend verticalAlign='bottom' height={24} />
        <Pie
          data={chartData}
          dataKey='value'
          nameKey='name'
          innerRadius={50}
          outerRadius={70}
          paddingAngle={4}
          cornerRadius={8}
          label={({ percent }) => `${Math.round(percent * 100)}%`}
        >
          {chartData.map((entry, idx) => (
            <Cell
              key={entry.name}
              fill={idx === 0 ? 'var(--chart-5)' : 'var(--chart-6)'}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}

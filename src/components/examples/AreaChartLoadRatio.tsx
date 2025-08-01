'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import {
  ChartContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from '@/components/ui/chart'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

const loadData = Array.from({ length: 28 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (27 - i))
  const acute = Math.round(50 + Math.random() * 20)
  const chronic = Math.round(40 + Math.random() * 25)
  const ratio = +(acute / chronic).toFixed(2)
  return {
    date: date.toISOString().slice(0, 10),
    ratio,
  }
})

const chartConfig = {
  ratio: { label: 'AC Ratio', color: 'hsl(var(--chart-4))' },
} as const

export default function AreaChartLoadRatio() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acute:Chronic Load Ratio</CardTitle>
        <CardDescription>Short-term load compared to longer-term training baseline (last 4 weeks)</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-64'>
          <AreaChart data={loadData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              tickFormatter={(d) => new Date(d).toLocaleDateString()}
            />
            <YAxis domain={[0, 2]} />
            <ChartTooltip />
            <Area
              type='monotone'
              dataKey='ratio'
              stroke={chartConfig.ratio.color}
              fill={chartConfig.ratio.color}
              fillOpacity={0.3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex items-center gap-2 text-sm'>
        {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
      </CardFooter>
    </Card>
  )
}

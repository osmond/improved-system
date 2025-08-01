'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import { Cell } from 'recharts'

const scatterData = Array.from({ length: 200 }, () => {
  const pace = 6 + Math.random() * 2
  const hr = 120 + Math.random() * 40
  const zone = Math.min(5, Math.max(0, Math.floor((hr - 120) / 8)))
  return {
    pace,
    hr,
    fill: `var(--chart-${zone + 5})`,
  }
})

const chartConfig = {
  pace: { label: 'Pace', color: 'hsl(var(--chart-9))' },
  hr: { label: 'Heart Rate', color: 'hsl(var(--chart-10))' },
} as const

export default function ScatterChartPaceHeartRate() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pace vs Heart Rate</CardTitle>
        <CardDescription>Correlation of effort and speed from recent runs</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className='h-64'>
          <ScatterChart>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='pace' name='Pace (min/mi)' />
            <YAxis dataKey='hr' name='Heart Rate (bpm)' />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Scatter data={scatterData}>
              {scatterData.map((pt, idx) => (
                <Cell key={idx} fill={pt.fill} />
              ))}
            </Scatter>
          </ScatterChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex items-center gap-2 text-sm'>
        {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
      </CardFooter>
    </Card>
  )
}

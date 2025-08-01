'use client'

import React from 'react'
import {
  ChartContainer,
  PieChart,
  Pie,
  Tooltip as ChartTooltip,
  ChartLegend,
} from '@/components/ui/chart'
import { Cell } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export const description = 'A treadmill vs outdoor chart'

const monthlyData = [
  { month: 'january', outdoor: 180, treadmill: 60 },
  { month: 'february', outdoor: 170, treadmill: 70 },
  { month: 'march', outdoor: 190, treadmill: 50 },
  { month: 'april', outdoor: 210, treadmill: 40 },
  { month: 'may', outdoor: 200, treadmill: 55 },
] as const

const chartConfig = {
  Outdoor: { label: 'Outdoor', color: 'hsl(var(--chart-5))' },
  Treadmill: { label: 'Treadmill', color: 'hsl(var(--chart-6))' },
} satisfies Record<string, unknown>

export default function TreadmillVsOutdoorExample() {
  const [activeMonth, setActiveMonth] = React.useState(monthlyData[0].month)

  const pieData = React.useMemo(() => {
    const current = monthlyData.find((d) => d.month === activeMonth) ?? monthlyData[0]
    return [
      { name: 'Outdoor', value: current.outdoor },
      { name: 'Treadmill', value: current.treadmill },
    ]
  }, [activeMonth])

  return (
    <Card className='flex flex-col'>
      <CardHeader className='flex-row items-start space-y-0 pb-0'>
        <div className='grid gap-1'>
          <CardTitle>Indoor vs Outdoor Split</CardTitle>
          <CardDescription>Comparison of workout volume or sessions (e.g., treadmill vs outdoor activities)</CardDescription>
        </div>
        <Select
          value={activeMonth}
          onValueChange={(v) => setActiveMonth(v as (typeof activeMonth))}
        >
          <SelectTrigger className='ml-auto h-7 w-[130px] rounded-lg pl-2.5' aria-label='Select month'>
            <SelectValue placeholder='Select month' />
          </SelectTrigger>
          <SelectContent align='end' className='rounded-xl'>
            {monthlyData.map((m) => (
              <SelectItem key={m.month} value={m.month} className='capitalize'>
                {m.month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className='flex flex-1 justify-center pb-0'>
        <ChartContainer config={chartConfig} className='h-60'>
          <PieChart width={200} height={160}>
            <ChartTooltip />
            <ChartLegend verticalAlign='bottom' height={24} />
            <Pie
              data={pieData}
              dataKey='value'
              nameKey='name'
              innerRadius={50}
              outerRadius={70}
              paddingAngle={4}
              cornerRadius={8}
              label={({ percent }) => `${Math.round(percent * 100)}%`}
            >
              {pieData.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={`hsl(var(--chart-${entry.name === 'Outdoor' ? 5 : 6}))`}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import { Pie, PieChart } from 'recharts'
import useReadingMediumTotals from '@/hooks/useReadingMediumTotals'
import { Skeleton } from '@/components/ui/skeleton'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A donut chart'

// Distribution of reading minutes by medium
const labels: Record<string, string> = {
  phone: 'Phone',
  computer: 'Computer',
  tablet: 'Tablet',
  kindle: 'Kindle',
  real_book: 'Real Book',
  other: 'Other',
}

export default function ChartPieDonut() {
  const data = useReadingMediumTotals()

  if (!data) return <Skeleton className='h-64' />

  const chartConfig: ChartConfig = { minutes: { label: 'Minutes' } }
  data.forEach((d, i) => {
    ;(chartConfig as any)[d.medium] = {
      label: labels[d.medium],
      color: `hsl(var(--chart-${i + 1}))`,
    }
  })

  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Pie Chart - Donut</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer config={chartConfig} className='mx-auto aspect-square max-h-[250px]'>
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey='minutes' nameKey='medium' innerRadius={60} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total reading minutes for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}


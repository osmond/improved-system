'use client'

import { TrendingUp } from 'lucide-react'
import { generateTrendMessage } from '@/lib/utils'
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card'
import { ChartConfig, ChartContainer } from '@/ui/chart'

export const description = 'A radial chart with text'

// Total workout minutes across all activities
// for the last six months
const chartData = [
  { activity: 'Run', minutes: 7200, fill: 'var(--color-run)' },
]

const chartConfig = {
  minutes: {
    label: 'Minutes',
  },
  run: {
    label: 'Run',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function ChartRadialText() {
  return (
    <Card className='flex flex-col'>
      <CardHeader className='items-center pb-0'>
        <CardTitle>Total Workout Minutes</CardTitle>
        <CardDescription>Aggregate training time for the last 6 months</CardDescription>
      </CardHeader>
      <CardContent className='flex-1 pb-0'>
        <ChartContainer
          config={chartConfig}
          className='mx-auto aspect-square max-h-[250px] md:max-h-[300px] lg:max-h-[350px]'
        >
          <RadialBarChart
            data={chartData}
            startAngle={0}
            endAngle={250}
            innerRadius={80}
            outerRadius={110}
          >
            <PolarGrid
              gridType='circle'
              radialLines={false}
              stroke='none'
              className='first:fill-muted last:fill-background'
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey='minutes' background cornerRadius={10} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor='middle'
                        dominantBaseline='middle'
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className='fill-foreground text-4xl font-bold'
                        >
                          {chartData[0].minutes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className='fill-muted-foreground'
                        >
                          Minutes
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col gap-2 text-sm'>
        <div className='flex items-center gap-2 leading-none font-medium'>
          {generateTrendMessage()} <TrendingUp className='h-4 w-4' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total workout minutes for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}

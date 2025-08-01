'use client'

import React from 'react'
import {
  ChartContainer,
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from '@/components/ui/chart'
import ChartCard from '@/components/dashboard/ChartCard'

interface PerfPoint {
  pace: number
  power: number
  temperature: number
  humidity: number
  wind: number
  elevation: number
}

function generateData(count = 50): PerfPoint[] {
  return Array.from({ length: count }, () => {
    const pace = 6 + Math.random() * 2 // 6-8 min/mi
    const power = 250 - pace * 20 + Math.random() * 10
    return {
      pace: +pace.toFixed(2),
      power: Math.round(power),
      temperature: Math.round(40 + pace * 5 + Math.random() * 10),
      humidity: Math.round(40 + Math.random() * 50),
      wind: +(Math.random() * 20).toFixed(1),
      elevation: Math.round(Math.random() * 300),
    }
  })
}

function regression(
  data: PerfPoint[],
  xKey: keyof PerfPoint,
  yKey: keyof PerfPoint
): { [k in keyof PerfPoint]?: number }[] {
  const xs = data.map((d) => d[xKey] as number)
  const ys = data.map((d) => d[yKey] as number)
  const xMean = xs.reduce((a, b) => a + b, 0) / xs.length
  const yMean = ys.reduce((a, b) => a + b, 0) / ys.length
  let num = 0
  let den = 0
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean)
    den += (xs[i] - xMean) ** 2
  }
  const slope = num / den
  const intercept = yMean - slope * xMean
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  return [
    { [xKey]: minX, [yKey]: intercept + slope * minX },
    { [xKey]: maxX, [yKey]: intercept + slope * maxX },
  ]
}

const DATA = generateData()

const config = {
  pace: { label: 'Pace', color: 'var(--chart-8)' },
  trend: { label: 'Trend', color: 'var(--chart-3)' },
} as const

export default function PerfVsEnvironmentMatrixExample() {
  const tempReg = regression(DATA, 'temperature', 'pace')
  const humidityReg = regression(DATA, 'humidity', 'pace')
  const windReg = regression(DATA, 'wind', 'pace')
  const elevReg = regression(DATA, 'elevation', 'pace')

  return (
    <ChartCard title='Perf vs Environment' className='space-y-4'>
      <div className='grid gap-4 md:grid-cols-2'>
        <ChartContainer config={config} className='h-60'>
          <ScatterChart>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='temperature' name='Temp (F)' />
            <YAxis dataKey='pace' name='Pace (min/mi)' />
            <ChartTooltip />
            <Scatter data={DATA} fill={config.pace.color} />
            <Line data={tempReg} stroke={config.trend.color} dot={false} />
          </ScatterChart>
        </ChartContainer>
        <ChartContainer config={config} className='h-60'>
          <ScatterChart>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='humidity' name='Humidity (%)' />
            <YAxis dataKey='pace' name='Pace (min/mi)' />
            <ChartTooltip />
            <Scatter data={DATA} fill={config.pace.color} />
            <Line data={humidityReg} stroke={config.trend.color} dot={false} />
          </ScatterChart>
        </ChartContainer>
        <ChartContainer config={config} className='h-60'>
          <ScatterChart>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='wind' name='Wind (mph)' />
            <YAxis dataKey='pace' name='Pace (min/mi)' />
            <ChartTooltip />
            <Scatter data={DATA} fill={config.pace.color} />
            <Line data={windReg} stroke={config.trend.color} dot={false} />
          </ScatterChart>
        </ChartContainer>
        <ChartContainer config={config} className='h-60'>
          <ScatterChart>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='elevation' name='Elevation (ft)' />
            <YAxis dataKey='pace' name='Pace (min/mi)' />
            <ChartTooltip />
            <Scatter data={DATA} fill={config.pace.color} />
            <Line data={elevReg} stroke={config.trend.color} dot={false} />
          </ScatterChart>
        </ChartContainer>
      </div>
    </ChartCard>
  )
}

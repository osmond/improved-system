"use client"

import { useEffect, useState } from "react"
import ChartCard from "@/components/dashboard/ChartCard"
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ChartTooltip,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { getRunningSessions, type RunningSession } from "@/lib/api"

function shannonEntropy(counts: number[]): number {
  const total = counts.reduce((a, b) => a + b, 0)
  if (!total) return 0
  return -counts.reduce((sum, c) => {
    if (!c) return sum
    const p = c / total
    return sum + p * Math.log2(p)
  }, 0)
}

export default function SessionStartEntropy() {
  const [data, setData] = useState<{ date: string; entropy: number }[] | null>(null)

  useEffect(() => {
    getRunningSessions().then((sessions: RunningSession[]) => {
      const sorted = [...sessions].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime(),
      )
      const windowDays = 7
      const counts = Array(24).fill(0)
      const result: { date: string; entropy: number }[] = []
      let startIdx = 0
      for (let i = 0; i < sorted.length; i++) {
        const current = new Date(sorted[i].start)
        counts[current.getHours()]++
        const windowStart = new Date(current)
        windowStart.setDate(current.getDate() - (windowDays - 1))
        while (
          startIdx <= i &&
          new Date(sorted[startIdx].start) < windowStart
        ) {
          const h = new Date(sorted[startIdx].start).getHours()
          counts[h]--
          startIdx++
        }
        result.push({
          date: current.toISOString().slice(0, 10),
          entropy: shannonEntropy(counts),
        })
      }
      setData(result)
    })
  }, [])

  if (!data) return <Skeleton className="h-64" />

  const config = {
    entropy: { label: "Entropy", color: "hsl(var(--chart-1))" },
  }

  return (
    <ChartCard
      title="Start Time Entropy"
      description="Rolling 7-day entropy of session start times"
    >
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => new Date(d).toLocaleDateString()}
          />
          <YAxis domain={[0, Math.log2(24)]} />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="entropy"
            stroke="var(--color-entropy)"
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </ChartCard>
  )
}


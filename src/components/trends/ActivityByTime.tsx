"use client"

import React, { useMemo, useState } from "react"
import {
  ChartContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ChartTooltip,
  ChartTooltipContent,
} from "@/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { SimpleSelect } from "@/ui/select"
import useReadingSessions from "@/hooks/useReadingSessions"
import { Skeleton } from "@/ui/skeleton"

const timeLabels = [
  "12am",
  "2am",
  "4am",
  "6am",
  "8am",
  "10am",
  "12pm",
  "2pm",
  "4pm",
  "6pm",
  "8pm",
  "10pm",
]

export default function ActivityByTime() {
  const { data: sessions, isLoading, error } = useReadingSessions()
  const [aggregation, setAggregation] = useState("count")

  const chartData = useMemo(() => {
    const bins: number[][] = Array.from({ length: 12 }, () => [])
    sessions?.forEach((s) => {
      const hour = new Date(s.start).getHours()
      const bin = Math.floor(hour / 2)
      bins[bin].push(s.duration)
    })
    return bins.map((arr, i) => {
      let value = 0
      if (aggregation === "count") {
        value = arr.length
      } else if (aggregation === "mean") {
        value = arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0
      } else if (aggregation === "median") {
        if (arr.length) {
          const sorted = [...arr].sort((a, b) => a - b)
          const mid = Math.floor(sorted.length / 2)
          value =
            sorted.length % 2 === 0
              ? (sorted[mid - 1] + sorted[mid]) / 2
              : sorted[mid]
        }
      }
      return { time: timeLabels[i], value }
    })
  }, [sessions, aggregation])

  const config = useMemo(
    () => ({
      value: {
        label: aggregation === "count" ? "Sessions" : "Minutes",
        color: "var(--chart-2)",
      },
    }),
    [aggregation],
  )

  if (isLoading) {
    return <Skeleton className="h-64" />
  }
  if (error) {
    return <div role="alert">Unable to load sessions.</div>
  }

  return (
    <ChartCard title="Activity by Time of Day" description="Reading sessions by time">
      <div className="mb-4">
        <SimpleSelect
          value={aggregation}
          onValueChange={setAggregation}
          options={[
            { value: "count", label: "Count" },
            { value: "mean", label: "Mean duration" },
            { value: "median", label: "Median duration" },
          ]}
          label="Aggregation"
        />
      </div>
      <ChartContainer
        config={config}
        className="mx-auto aspect-square max-h-[250px] md:max-h-[300px] lg:max-h-[350px]"
      >
        <RadarChart data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="time" />
          <PolarRadiusAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Radar
            name="Activity"
            dataKey="value"
            stroke="var(--color-value)"
            fill="var(--color-value)"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ChartContainer>
    </ChartCard>
  )
}

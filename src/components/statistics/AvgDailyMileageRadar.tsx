"use client"

import {
  ChartContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"

const dailyMileage = [
  { day: "Mon", miles: 5 },
  { day: "Tue", miles: 6 },
  { day: "Wed", miles: 4 },
  { day: "Thu", miles: 5.5 },
  { day: "Fri", miles: 3 },
  { day: "Sat", miles: 8 },
  { day: "Sun", miles: 7 },
]

const config = {
  miles: { label: "Miles", color: "var(--chart-3)" },
} satisfies Record<string, unknown>

export default function AvgDailyMileageRadar() {
  return (
    <ChartContainer config={config} className="h-64" title="Average Daily Mileage">
      <RadarChart data={dailyMileage}>
        <PolarGrid />
        <PolarAngleAxis dataKey="day" />
        <PolarRadiusAxis />
        <ChartTooltip />
        <Radar
          name="Mileage"
          dataKey="miles"
          stroke="var(--chart-3)"
          fill="var(--chart-3)"
          fillOpacity={0.4}
        />
      </RadarChart>
    </ChartContainer>
  )
}

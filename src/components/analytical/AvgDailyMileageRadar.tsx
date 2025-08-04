"use client"

import {
  ChartContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ChartTooltip,
  ChartLegend,
  ChartLegendContent,
} from "@/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"

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
  miles: { label: "Miles", color: "hsl(var(--chart-3))" },
} satisfies Record<string, unknown>

export default function AvgDailyMileageRadar() {
  return (
    <ChartCard
      title="Average Daily Mileage"
      description="Average mileage by day of week"
    >
      <ChartContainer config={config} className="h-64 md:h-80 lg:h-96">
        <RadarChart data={dailyMileage}>
          <PolarGrid />
          <PolarAngleAxis dataKey="day" />
          <PolarRadiusAxis />
          <ChartTooltip />
          <ChartLegend content={<ChartLegendContent />} />
          <Radar
            name="Mileage"
            dataKey="miles"
            stroke={config.miles.color}
            fill={config.miles.color}
            fillOpacity={0.4}
          />
        </RadarChart>
      </ChartContainer>
    </ChartCard>
  )
}

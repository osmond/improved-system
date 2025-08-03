"use client"

import {
  ChartContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip as ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"

const activityByTimeData = [
  { time: "12am", value: 2 },
  { time: "2am", value: 1 },
  { time: "4am", value: 0 },
  { time: "6am", value: 8 },
  { time: "8am", value: 12 },
  { time: "10am", value: 4 },
  { time: "12pm", value: 5 },
  { time: "2pm", value: 1 },
  { time: "4pm", value: 2 },
  { time: "6pm", value: 6 },
  { time: "8pm", value: 3 },
  { time: "10pm", value: 2 },
]

const config = {
  value: { label: "Sessions", color: "var(--chart-2)" },
} satisfies Record<string, unknown>

export default function ActivityByTime() {
  return (
    <ChartCard
      title="Workout Activity by Time"
      description="Sessions by time of day"
    >
      <ChartContainer
        config={config}
        className="mx-auto aspect-square max-h-[250px] md:max-h-[300px] lg:max-h-[350px]"
      >
        <RadarChart data={activityByTimeData}>
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

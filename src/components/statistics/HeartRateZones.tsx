"use client"

import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"

const hrZoneData = [
  { zone: "Recovery", bpm: 120 },
  { zone: "Easy", bpm: 137 },
  { zone: "Tempo", bpm: 161 },
  { zone: "Threshold", bpm: 180 },
]

const config = {
  bpm: { label: "Heart Rate", color: "var(--chart-8)" },
} satisfies Record<string, unknown>

export default function HeartRateZones() {
  return (
    <ChartCard title="Heart Rate Zones">
      <ChartContainer config={config} className="h-60">
        <BarChart data={hrZoneData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="zone" tickLine={false} axisLine={false} />
          <ChartTooltip />
          <Bar dataKey="bpm" fill="var(--chart-8)" radius={4} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

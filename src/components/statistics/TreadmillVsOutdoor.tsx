"use client"

import {
  ChartContainer,
  PieChart,
  Pie,
  Tooltip as ChartTooltip,
  ChartLegend,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { Cell } from "recharts"


const treadmillData = [
  { name: "Outdoor", value: 1254 },
  { name: "Treadmill", value: 477 },
]

const config = {
  Outdoor: { label: "Outdoor", color: "var(--chart-5)" },
  Treadmill: { label: "Treadmill", color: "var(--chart-6)" },
} satisfies Record<string, unknown>

export default function TreadmillVsOutdoor() {
  return (
    <ChartCard
      title="Treadmill vs Outdoor"
      description="Indoor vs outdoor mileage split"
    >
      <ChartContainer config={config} className="h-60">
        <PieChart width={200} height={160}>
          <ChartTooltip />

          <ChartLegend verticalAlign="bottom" height={24} />

          <Pie
            data={treadmillData}
            dataKey="value"
            nameKey="name"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={4}
            cornerRadius={8}
            label={({ percent }) => `${Math.round(percent * 100)}%`}
          >
            {treadmillData.map((entry, idx) => (
              <Cell
                key={entry.name}
                fill={idx === 0 ? "var(--chart-5)" : "var(--chart-6)"}
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </ChartCard>
  )
}

"use client"

import {
  ChartContainer,
  PieChart,
  Pie,
  Tooltip as ChartTooltip,
  ChartLegend,
  ResponsiveContainer,
} from "@/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { Cell } from "recharts"


const treadmillData = [
  { name: "Outdoor", value: 1254 },
  { name: "Treadmill", value: 477 },
]

const config = {
  Outdoor: { label: "Outdoor", color: "hsl(var(--chart-5))" },
  Treadmill: { label: "Treadmill", color: "hsl(var(--chart-6))" },
} satisfies Record<string, unknown>

export default function TreadmillVsOutdoor() {
  return (
    <ChartCard
      title="Treadmill vs Outdoor"
      description="Indoor vs outdoor mileage split"
    >
      <ChartContainer config={config} className="h-60 md:h-80 lg:h-96">
        <ResponsiveContainer>
          <PieChart>
            <defs>
              <linearGradient id="treadmill-gradient-outdoor">
                <stop offset="0%" stopColor="hsl(var(--chart-5))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-5))" stopOpacity={0.5} />
              </linearGradient>
              <linearGradient id="treadmill-gradient-indoor">
                <stop offset="0%" stopColor="hsl(var(--chart-6))" stopOpacity={0.8} />
                <stop offset="100%" stopColor="hsl(var(--chart-6))" stopOpacity={0.5} />
              </linearGradient>
            </defs>
            <ChartTooltip />

            <ChartLegend verticalAlign="bottom" height={24} />

            <Pie
              data={treadmillData}
              dataKey="value"
              nameKey="name"
              innerRadius="60%"
              outerRadius="85%"
              paddingAngle={4}
              cornerRadius={8}
              label={({ percent }) => `${Math.round(percent * 100)}%`}
            >
              {treadmillData.map((entry, idx) => (
                <Cell
                  key={entry.name}
                  fill={idx === 0 ? "url(#treadmill-gradient-outdoor)" : "url(#treadmill-gradient-indoor)"}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>
    </ChartCard>
  )
}

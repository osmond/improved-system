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

const annualData = [
  { month: "1", miles: 1200 },
  { month: "2", miles: 1100 },
  { month: "3", miles: 950 },
  { month: "4", miles: 1500 },
  { month: "5", miles: 1600 },
  { month: "6", miles: 800 },
  { month: "7", miles: 1400 },
  { month: "8", miles: 1800 },
  { month: "9", miles: 1300 },
  { month: "10", miles: 1000 },
  { month: "11", miles: 500 },
]

const config = {
  miles: { label: "Mileage", color: "var(--chart-1)" },
} satisfies Record<string, unknown>

export default function AnnualMileage() {
  return (
    <ChartCard title="Annual Mileage">
      <ChartContainer config={config} className="h-64">
        <BarChart data={annualData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip />
          <Bar dataKey="miles" fill="var(--chart-1)" radius={2} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

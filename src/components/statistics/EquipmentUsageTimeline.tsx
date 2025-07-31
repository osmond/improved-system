"use client"

import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ReferenceLine,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"

const usageData = [
  { month: "Jan", shoe: 50, bike: 120 },
  { month: "Feb", shoe: 110, bike: 240 },
  { month: "Mar", shoe: 170, bike: 360 },
  { month: "Apr", shoe: 230, bike: 420 },
  { month: "May", shoe: 310, bike: 500 },
  { month: "Jun", shoe: 370, bike: 580 },
]

const REPLACEMENT_MILES = 300

const config = {
  shoe: { label: "Shoes", color: "var(--chart-4)" },
  bike: { label: "Bike", color: "var(--chart-5)" },
  replacement: { label: "Replacement", color: "var(--chart-6)" },
} satisfies Record<string, unknown>

export default function EquipmentUsageTimeline() {
  return (
    <ChartCard title="Equipment Usage">
      <ChartContainer config={config} className="h-64">
        <BarChart data={usageData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ReferenceLine y={REPLACEMENT_MILES} stroke={config.replacement.color} strokeDasharray="4 4" />
          <ChartTooltip />
          <Bar dataKey="shoe" stackId="usage" fill={config.shoe.color} />
          <Bar dataKey="bike" stackId="usage" fill={config.bike.color} />
        </BarChart>
      </ChartContainer>
    </ChartCard>
  )
}

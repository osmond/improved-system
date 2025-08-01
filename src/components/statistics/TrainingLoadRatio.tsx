"use client"

import {
  ChartContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"

const loadData = Array.from({ length: 28 }, (_, i) => {
  const date = new Date()
  date.setDate(date.getDate() - (27 - i))
  const acute = Math.round(50 + Math.random() * 20)
  const chronic = Math.round(40 + Math.random() * 25)
  const ratio = +(acute / chronic).toFixed(2)
  return {
    date: date.toISOString().slice(0, 10),
    ratio,
  }
})

const config = {
  ratio: { label: "AC Ratio", color: "var(--chart-4)" },
} satisfies Record<string, unknown>

export default function TrainingLoadRatio() {
  return (
    <ChartCard
      title="Acute vs Chronic Load Ratio"
      description="Acute vs chronic training load"
    >
      <ChartContainer config={config} className="h-64">
        <AreaChart data={loadData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(d) => new Date(d).toLocaleDateString()}
          />
          <YAxis domain={[0, 2]} />
          <ChartTooltip />
          <Area
            type="monotone"
            dataKey="ratio"
            stroke="var(--chart-4)"
            fill="var(--chart-4)"
            fillOpacity={0.3}
          />
        </AreaChart>
      </ChartContainer>
    </ChartCard>
  )
}

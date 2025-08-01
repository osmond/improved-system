"use client"

import {
  ChartContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart"
import ChartCard from "@/components/dashboard/ChartCard"
import { Cell } from "recharts"

const scatterData = Array.from({ length: 200 }, () => {
  const pace = 6 + Math.random() * 2
  const hr = 120 + Math.random() * 40
  const zone = Math.min(5, Math.max(0, Math.floor((hr - 120) / 8)))
  return {
    pace,
    hr,
    fill: `var(--chart-${zone + 5})`,
  }
})

const config = {
  pace: { label: "Pace", color: "var(--chart-9)" },
  hr: { label: "Heart Rate", color: "var(--chart-10)" },
} satisfies Record<string, unknown>

export default function PaceVsHR() {
  return (
    <ChartCard
      title="Pace vs Heart Rate"
      description="Correlation between pace and heart rate"
    >
      <ChartContainer config={config} className="h-64">
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="pace" name="Pace (min/mi)" />
          <YAxis dataKey="hr" name="Heart Rate (bpm)" />
          <ChartTooltip />
          <Scatter data={scatterData}>
            {scatterData.map((pt, idx) => (
              <Cell key={idx} fill={pt.fill} />
            ))}
          </Scatter>
        </ScatterChart>
      </ChartContainer>
    </ChartCard>
  )
}

import React from "react"
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ChartTooltip,
  ChartTooltipContent,
  Cell,
} from "@/ui/chart"
import type { ChartConfig } from "@/ui/chart"

export interface CityBreakdownProps {
  cities: { name: string; days: number; miles: number }[]
}

export default function StateCityBreakdown({ cities }: CityBreakdownProps) {
  if (!cities?.length) return null

  const config = {
    days: {
      label: "Days",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig

  const height = Math.max(80, cities.length * 24)

  return (
    <ChartContainer config={config} style={{ height }} className="w-full mt-2">
      <BarChart
        data={cities}
        layout="vertical"
        margin={{ left: 40, right: 16, top: 8, bottom: 8 }}
      >
        <XAxis type="number" dataKey="days" hide />
        <YAxis type="category" dataKey="name" width={80} tickLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} cursor={false} />
        <Bar dataKey="days" fill="var(--color-days)" radius={[0, 4, 4, 0]}>
          {cities.map((c) => (
            <Cell
              key={c.name}
              role="img"
              tabIndex={0}
              aria-label={`${c.name}: ${c.days}`}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}


// ALL CHART EXAMPLES IN ONE FILE (for clarity / review).
// Each section is self-contained and annotated.
// Replace the placeholder ChartConfig typing with the actual exported type from your codebase.
// Verify import paths and available components in "@/components/ui/chart".

"use client"

import {
  ChartContainer,
  AreaChart,
  LineChart,
  PieChart,
  RadarChart,
  RadialBarChart,
  BarChart,
  Area,
  Line,
  Pie,
  Radar,
  RadialBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ChartLegend as Legend,
  Cell,
} from "@/components/ui/chart"
import type { ChartConfig } from "@/components/ui/chart"

// ---------- SAMPLE DATA & CONFIGS ----------

// Area chart sample
const areaData = [
  { day: "Mon", value: 30 },
  { day: "Tue", value: 45 },
  { day: "Wed", value: 28 },
  { day: "Thu", value: 60 },
  { day: "Fri", value: 50 },
  { day: "Sat", value: 70 },
  { day: "Sun", value: 65 },
]
const areaConfig = {
  value: { label: "Value", color: "var(--chart-3)" },
} satisfies ChartConfig

// Line chart sample
const lineData = [
  { day: "Mon", metricA: 40, metricB: 65 },
  { day: "Tue", metricA: 55, metricB: 70 },
  { day: "Wed", metricA: 50, metricB: 60 },
  { day: "Thu", metricA: 75, metricB: 85 },
  { day: "Fri", metricA: 60, metricB: 90 },
  { day: "Sat", metricA: 90, metricB: 95 },
  { day: "Sun", metricA: 80, metricB: 88 },
]
const lineConfig = {
  metricA: { label: "Metric A", color: "var(--chart-4)" },
  metricB: { label: "Metric B", color: "var(--chart-5)" },
} satisfies ChartConfig

// Pie chart sample
const pieData = [
  { name: "Category A", value: 45 },
  { name: "Category B", value: 25 },
  { name: "Category C", value: 30 },
]
const pieConfig = {
  "Category A": { label: "Category A", color: "var(--chart-6)" },
  "Category B": { label: "Category B", color: "var(--chart-7)" },
  "Category C": { label: "Category C", color: "var(--chart-8)" },
} satisfies ChartConfig

// Radar chart sample
const radarData = [
  { subject: "Speed", A: 120, B: 98 },
  { subject: "Strength", A: 98, B: 86 },
  { subject: "Endurance", A: 86, B: 99 },
  { subject: "Flexibility", A: 99, B: 85 },
  { subject: "Agility", A: 85, B: 90 },
]
const radarConfig = {
  A: { label: "Profile A", color: "var(--chart-9)" },
  B: { label: "Profile B", color: "var(--chart-10)" },
} satisfies ChartConfig

// Radial / gauge-style composite sample
const gaugeData = [
  { name: "Hydration", value: 80, fill: "var(--chart-3)" },
  { name: "Light", value: 60, fill: "var(--chart-4)" },
  { name: "Nutrition", value: 90, fill: "var(--chart-5)" },
]
const gaugeConfig = {
  Hydration: { label: "Hydration", color: "var(--chart-3)" },
  Light: { label: "Light", color: "var(--chart-4)" },
  Nutrition: { label: "Nutrition", color: "var(--chart-5)" },
} satisfies ChartConfig

// Tooltip example data
const tooltipData = [
  { category: "A", value: 120 },
  { category: "B", value: 180 },
  { category: "C", value: 90 },
]
const tooltipConfig = {
  value: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig

// ---------- CUSTOM TOOLTIP COMPONENT ----------
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="bg-white p-2 rounded shadow border text-sm">
      <div className="font-semibold">{label}</div>
      <div>Value: {payload[0].value}</div>
    </div>
  )
}

// ---------- EXAMPLE CHART COMPONENTS ----------

// 1. Area chart example (simple area)
export function AreaChartExamples() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartContainer config={areaConfig} className="h-60" title="Simple Area">
        <AreaChart data={areaData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip />
          <Area
            type="monotone"
            dataKey="value"
            stroke="var(--chart-3)"
            fill="var(--chart-3)"
            strokeWidth={2}
            dot={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}

// 2. Line chart example (dual line comparison)
export function LineChartExamples() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartContainer config={lineConfig} className="h-60" title="Dual Line">
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <ChartTooltip />
          <Line
            type="monotone"
            dataKey="metricA"
            stroke="var(--chart-4)"
            strokeWidth={2}
            dot={false}
            name="Metric A"
          />
          <Line
            type="monotone"
            dataKey="metricB"
            stroke="var(--chart-5)"
            strokeWidth={2}
            dot={false}
            name="Metric B"
          />
        </LineChart>
      </ChartContainer>
    </div>
  )
}

// 3. Pie / breakdown chart example
export function PieChartExamples() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartContainer config={pieConfig} className="h-60" title="Breakdown Pie">
        <PieChart width={200} height={160}>
          <ChartTooltip />
          <Legend verticalAlign="bottom" height={36} />
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={4}
            cornerRadius={6}
            label={false}
          >
            {pieData.map((entry, idx) => (
              <Cell
                key={entry.name}
                fill={
                  idx === 0
                    ? "var(--chart-6)"
                    : idx === 1
                    ? "var(--chart-7)"
                    : "var(--chart-8)"
                }
              />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  )
}

// 4. Radar comparison example
export function RadarChartExamples() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartContainer
        config={radarConfig}
        className="h-60"
        title="Radar Comparison"
      >
        <RadarChart data={radarData}>
          <CartesianGrid />
          <XAxis dataKey="subject" />
          <YAxis />
          <ChartTooltip />
          <Legend />
          <Radar
            name="Profile A"
            dataKey="A"
            stroke="var(--chart-9)"
            fill="var(--chart-9)"
            fillOpacity={0.6}
          />
          <Radar
            name="Profile B"
            dataKey="B"
            stroke="var(--chart-10)"
            fill="var(--chart-10)"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ChartContainer>
    </div>
  )
}

// 5. Radial / gauge-style composite example
export function RadialChartExamples() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartContainer
        config={gaugeConfig}
        className="h-72"
        title="Composite Gauge"
      >
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="60%"
          outerRadius="100%"
          barSize={12}
          data={gaugeData}
          startAngle={90}
          endAngle={-270}
        >
          <ChartTooltip />
          <Legend
            iconSize={8}
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
          />
          <RadialBar
            background
            minAngle={15}
            clockWise
            dataKey="value"
            cornerRadius={8}
          />
        </RadialBarChart>
      </ChartContainer>
    </div>
  )
}

// 6. Custom tooltip example
export function TooltipExamples() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartContainer
        config={tooltipConfig}
        className="h-60"
        title="Custom Tooltip"
      >
        <BarChart data={tooltipData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="category" tickLine={false} axisLine={false} />
          <ChartTooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="value" fill="var(--chart-1)" radius={6} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}

// ---------- AGGREGATED EXAMPLES PAGE ----------

export default function ChartExamplesPage() {
  return (
    <div className="space-y-8 px-4 py-6">
      <h1 className="text-2xl font-bold">Chart Examples</h1>
      <section>
        {/* Area chart demo */}
        <AreaChartExamples />
      </section>
      <section>
        {/* Line chart demo */}
        <LineChartExamples />
      </section>
      <section>
        {/* Pie chart demo */}
        <PieChartExamples />
      </section>
      <section>
        {/* Radar chart demo */}
        <RadarChartExamples />
      </section>
      <section>
        {/* Radial / gauge-style composite */}
        <RadialChartExamples />
      </section>
      <section>
        {/* Tooltip customization example */}
        <TooltipExamples />
      </section>
    </div>
  )
}

import React from "react";
import {
  ChartContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

const simpleData = [
  { name: "A", value: 12 },
  { name: "B", value: 18 },
  { name: "C", value: 32 },
  { name: "D", value: 5 },
  { name: "E", value: 9 },
];

const stackedData = [
  { name: "Q1", alpha: 400, beta: 240, gamma: 240 },
  { name: "Q2", alpha: 300, beta: 139, gamma: 221 },
  { name: "Q3", alpha: 200, beta: 980, gamma: 229 },
  { name: "Q4", alpha: 278, beta: 390, gamma: 200 },
];

const groupedData = [
  { year: "2019", x: 100, y: 30, z: 50 },
  { year: "2020", x: 120, y: 40, z: 30 },
  { year: "2021", x: 98, y: 20, z: 80 },
  { year: "2022", x: 86, y: 32, z: 40 },
];

const horizontalData = [
  { label: "Alpha", value: 23 },
  { label: "Beta", value: 12 },
  { label: "Gamma", value: 19 },
  { label: "Delta", value: 30 },
];

const negativeData = [
  { name: "Jan", positive: 30, negative: -10 },
  { name: "Feb", positive: 20, negative: -20 },
  { name: "Mar", positive: 27, negative: -15 },
  { name: "Apr", positive: 18, negative: -8 },
  { name: "May", positive: 23, negative: -12 },
];

const simpleConfig = {
  value: { color: "hsl(var(--chart-1))", label: "Value" },
} satisfies ChartConfig;

const stackedConfig = {
  alpha: { color: "hsl(var(--chart-2))" },
  beta: { color: "hsl(var(--chart-3))" },
  gamma: { color: "hsl(var(--chart-4))" },
} satisfies ChartConfig;

const groupedConfig = {
  x: { color: "hsl(var(--chart-5))" },
  y: { color: "hsl(var(--chart-6))" },
  z: { color: "hsl(var(--chart-7))" },
} satisfies ChartConfig;

const horizontalConfig = {
  value: { color: "hsl(var(--chart-8))" },
} satisfies ChartConfig;

const negativeConfig = {
  positive: { color: "hsl(var(--chart-9))" },
  negative: { color: "hsl(var(--chart-10))" },
} satisfies ChartConfig;

export default function BarChartExamples() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <ChartContainer config={simpleConfig} className="h-60 md:h-80 lg:h-96" title="Simple Bar">
        <BarChart data={simpleData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={simpleConfig.value.color} />
        </BarChart>
      </ChartContainer>

      <ChartContainer
        config={stackedConfig}
        className="h-60 md:h-80 lg:h-96"
        title="Stacked Bar"
      >
        <BarChart data={stackedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="alpha" stackId="s" fill={stackedConfig.alpha.color} />
          <Bar dataKey="beta" stackId="s" fill={stackedConfig.beta.color} />
          <Bar dataKey="gamma" stackId="s" fill={stackedConfig.gamma.color} />
        </BarChart>
      </ChartContainer>

      <ChartContainer
        config={groupedConfig}
        className="h-60 md:h-80 lg:h-96"
        title="Grouped Bar"
      >
        <BarChart data={groupedData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="x" fill={groupedConfig.x.color} />
          <Bar dataKey="y" fill={groupedConfig.y.color} />
          <Bar dataKey="z" fill={groupedConfig.z.color} />
        </BarChart>
      </ChartContainer>

      <ChartContainer
        config={horizontalConfig}
        className="h-60 md:h-80 lg:h-96"
        title="Horizontal Bar"
      >
        <BarChart
          layout="vertical"
          data={horizontalData}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" hide />
          <YAxis dataKey="label" type="category" />
          <Tooltip />
          <Bar dataKey="value" fill={horizontalConfig.value.color} radius={[0, 4, 4, 0]} />
        </BarChart>
      </ChartContainer>

      <ChartContainer
        config={negativeConfig}
        className="h-60 md:h-80 lg:h-96"
        title="Negative Bar"
      >
        <BarChart data={negativeData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="positive" fill={negativeConfig.positive.color} />
          <Bar dataKey="negative" fill={negativeConfig.negative.color} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}

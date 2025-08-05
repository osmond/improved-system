import React from "react";
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip } from "recharts";

interface CorrelationDetailChartProps {
  data: { x: number; y: number }[];
}

export default function CorrelationDetailChart({ data }: CorrelationDetailChartProps) {
  return (
    <ScatterChart width={150} height={80} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
      <XAxis type="number" dataKey="x" hide />
      <YAxis type="number" dataKey="y" hide />
      <Tooltip />
      <Scatter data={data} fill="hsl(var(--chart-1))" />
    </ScatterChart>
  );
}


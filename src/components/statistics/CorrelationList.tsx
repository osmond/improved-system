import React from "react";
import {
  ChartContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

interface PairData {
  label1: string;
  label2: string;
  value: number;
  series: { a: number; b: number }[];
}

interface CorrelationListProps {
  pairs: PairData[];
}

function CorrelationSparkline({
  data,
  labels,
}: {
  data: { a: number; b: number }[];
  labels: [string, string];
}) {
  const config = {
    a: { label: labels[0], color: "hsl(var(--chart-1))" },
    b: { label: labels[1], color: "hsl(var(--chart-2))" },
  } satisfies ChartConfig;

  const all = data.flatMap((d) => [d.a, d.b]);
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const normalized = data.map((d, i) => ({
    index: i,
    a: (d.a - min) / range,
    b: (d.b - min) / range,
  }));

  return (
    <ChartContainer config={config} className="h-12 w-full">
      <LineChart data={normalized} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <XAxis dataKey="index" hide />
        <YAxis domain={[0, 1]} hide />
        <Line
          type="monotone"
          dataKey="a"
          stroke={config.a.color}
          strokeWidth={1.5}
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="b"
          stroke={config.b.color}
          strokeWidth={1.5}
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  );
}

export default function CorrelationList({ pairs }: CorrelationListProps) {
  return (
    <div className="space-y-4">
      {pairs.map((p) => (
        <div key={`${p.label1}-${p.label2}`} className="space-y-1">
          <div className="flex justify-between text-sm font-medium">
            <span>
              {p.label1} vs {p.label2}
            </span>
            <span>{p.value.toFixed(2)}</span>
          </div>
          <CorrelationSparkline data={p.series} labels={[p.label1, p.label2]} />
        </div>
      ))}
    </div>
  );
}


import React, { useMemo } from "react";
import {
  ChartContainer,
  ScatterChart,
  Scatter,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
} from "@/components/ui/chart";
import ChartCard from "@/components/dashboard/ChartCard";
import { Cell } from "recharts";
import { useRunningStats } from "@/hooks/useRunningStats";

interface PerfPoint {
  pace: number
  power: number
  temperature: number
  humidity: number
  wind: number
  elevation: number
  fill: string
}

function mapPoint(pace: number, temperature: number, humidity: number, wind: number, elevation: number): PerfPoint {
  const power = 250 - pace * 20 + Math.random() * 10
  const colorIndex = Math.min(5, Math.max(0, Math.floor((power - 90) / 10)))
  return {
    pace: +pace.toFixed(2),
    power: Math.round(power),
    temperature,
    humidity,
    wind,
    elevation,
    fill: `var(--chart-${colorIndex + 5})`,
  }
}

function regression(
  data: PerfPoint[],
  xKey: keyof PerfPoint,
  yKey: keyof PerfPoint
): { [k in keyof PerfPoint]?: number }[] {
  const xs = data.map((d) => d[xKey] as number);
  const ys = data.map((d) => d[yKey] as number);
  const xMean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const yMean = ys.reduce((a, b) => a + b, 0) / ys.length;
  let num = 0;
  let den = 0;
  for (let i = 0; i < xs.length; i++) {
    num += (xs[i] - xMean) * (ys[i] - yMean);
    den += (xs[i] - xMean) ** 2;
  }
  const slope = num / den;
  const intercept = yMean - slope * xMean;
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  return [
    { [xKey]: minX, [yKey]: intercept + slope * minX },
    { [xKey]: maxX, [yKey]: intercept + slope * maxX },
  ];
}

export default function PerfVsEnvironmentMatrix() {
  const stats = useRunningStats()
  const DATA = useMemo(() => {
    if (!stats) return []
    return stats.paceEnvironment.map((p) =>
      mapPoint(p.pace, p.temperature, p.humidity, p.wind, p.elevation),
    )
  }, [stats])

  const config = {
    pace: { label: "Pace", color: "var(--chart-8)" },
    trend: { label: "Trend", color: "var(--chart-3)" },
  } as const

  const tempReg = regression(DATA, "temperature", "pace")
  const humidityReg = regression(DATA, "humidity", "pace")
  const windReg = regression(DATA, "wind", "pace")
  const elevReg = regression(DATA, "elevation", "pace")

  return (
    <ChartCard
      title="Perf vs Environment"
      description="How pace varies with weather conditions"
      className="space-y-4"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <ChartContainer config={config} className="h-60">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="temperature" name="Temp (F)" />
            <YAxis dataKey="pace" name="Pace (min/mi)" />
            <ChartTooltip />
            <Scatter data={DATA}>
              {DATA.map((point, idx) => (
                <Cell key={idx} fill={point.fill} />
              ))}
            </Scatter>
            <Line data={tempReg} stroke={config.trend.color} dot={false} />
          </ScatterChart>
        </ChartContainer>
        <ChartContainer config={config} className="h-60">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="humidity" name="Humidity (%)" />
            <YAxis dataKey="pace" name="Pace (min/mi)" />
            <ChartTooltip />
            <Scatter data={DATA}>
              {DATA.map((point, idx) => (
                <Cell key={idx} fill={point.fill} />
              ))}
            </Scatter>
            <Line data={humidityReg} stroke={config.trend.color} dot={false} />
          </ScatterChart>
        </ChartContainer>
        <ChartContainer config={config} className="h-60">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="wind" name="Wind (mph)" />
            <YAxis dataKey="pace" name="Pace (min/mi)" />
            <ChartTooltip />
            <Scatter data={DATA}>
              {DATA.map((point, idx) => (
                <Cell key={idx} fill={point.fill} />
              ))}
            </Scatter>
            <Line data={windReg} stroke={config.trend.color} dot={false} />
          </ScatterChart>
        </ChartContainer>
        <ChartContainer config={config} className="h-60">
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="elevation" name="Elevation (ft)" />
            <YAxis dataKey="pace" name="Pace (min/mi)" />
            <ChartTooltip />
            <Scatter data={DATA}>
              {DATA.map((point, idx) => (
                <Cell key={idx} fill={point.fill} />
              ))}
            </Scatter>
            <Line data={elevReg} stroke={config.trend.color} dot={false} />
          </ScatterChart>
        </ChartContainer>
      </div>
    </ChartCard>
  );
}

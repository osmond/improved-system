import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceArea,
  ReferenceDot,
  ChartTooltip as Tooltip,
  ChartContainer,
} from "@/ui/chart";
import useLowEndDevice from "@/hooks/useLowEndDevice";
import type { FocusEvent } from "@/hooks/useFocusHistory";

interface FocusTimelineProps {
  events: FocusEvent[];
}

interface Segment {
  start: number;
  end: number;
  state: "focus" | "distracted";
}

const stateColors: Record<Segment["state"], string> = {
  focus: "#d1fae5", // green-100
  distracted: "#fee2e2", // red-100
};

export default function FocusTimeline({ events }: FocusTimelineProps) {
  const lowEnd = useLowEndDevice();

  const { segments, confidence, bubbles, start, end } = useMemo(() => {
    const now = Date.now();
    const start = now - 60 * 60 * 1000; // last hour
    const end = now;
    const relevant = events
      .filter((e) => e.timestamp >= start)
      .sort((a, b) => a.timestamp - b.timestamp);

    const segments: Segment[] = [];
    let state: Segment["state"] = "focus";
    let cursor = start;
    relevant.forEach((e) => {
      segments.push({ start: cursor, end: e.timestamp, state });
      state = e.type === "detection" ? "distracted" : "focus";
      cursor = e.timestamp;
    });
    segments.push({ start: cursor, end, state });

    const step = lowEnd ? 5 : 1; // minutes
    const confidence = [] as { time: number; confidence: number }[];
    for (let t = start; t <= end; t += step * 60 * 1000) {
      const seg = segments.find((s) => t >= s.start && t < s.end) ?? segments[0];
      const base = seg.state === "focus" ? 0.8 : 0.3;
      const jitter = lowEnd ? 0 : (Math.random() - 0.5) * 0.1;
      confidence.push({ time: t, confidence: +(base + jitter).toFixed(2) });
    }

    const bubbles = relevant
      .filter((e) => e.type === "detection")
      .map((e) => ({ time: e.timestamp }));

    return { segments, confidence, bubbles, start, end };
  }, [events, lowEnd]);

  const chartConfig = {
    confidence: {
      label: "Confidence",
      color: "hsl(var(--chart-1))",
    },
  } as const;

  return (
    <ChartContainer config={chartConfig} className="w-full h-48">
      <AreaChart data={confidence} margin={{ left: 0, right: 0, top: 0, bottom: 0 }}>
        <defs>
          {!lowEnd && (
            <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          )}
        </defs>
        <XAxis
          dataKey="time"
          type="number"
          domain={[start, end]}
          hide
        />
        <YAxis domain={[0, 1]} hide />
        {segments.map((s, idx) => (
          <ReferenceArea
            key={idx}
            x1={s.start}
            x2={s.end}
            y1={0}
            y2={1}
            fill={stateColors[s.state]}
            stroke="none"
          />
        ))}
        <Area
          type="monotone"
          dataKey="confidence"
          stroke="#3b82f6"
          fill={lowEnd ? "#3b82f6" : "url(#confidenceGradient)"}
          isAnimationActive={!lowEnd}
        />
        {!lowEnd &&
          bubbles.map((b, idx) => (
            <ReferenceDot
              key={idx}
              x={b.time}
              y={1}
              r={6}
              fill="#ef4444"
              stroke="none"
            />
          ))}
        <Tooltip
          formatter={(value: number) => value.toFixed(2)}
          labelFormatter={() => ""}
        />
      </AreaChart>
    </ChartContainer>
  );
}


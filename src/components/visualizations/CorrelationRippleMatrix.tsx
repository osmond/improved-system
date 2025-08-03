"use client";

import { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Rectangle,
  LineChart,
  Line,
  Tooltip,
} from "recharts";

interface CorrelationRippleMatrixProps {
  matrix: number[][]; // correlation values between -1 and 1
  labels: string[]; // axis labels
  drilldown?: Record<string, { x: number; y: number }[]>; // optional mini chart data
  cellSize?: number; // optional explicit cell size
  showValues?: boolean; // toggle numeric annotations
}

interface CellData {
  x: number; // column index
  y: number; // row index
  value: number;
}

// simple blue to red scale
function colorScale(v: number) {
  const hue = v >= 0 ? 0 : 240; // red for positive, blue for negative
  const saturation = Math.round(Math.abs(v) * 100);
  return `hsl(${hue}, ${saturation}%, 50%)`;
}

export default function CorrelationRippleMatrix({
  matrix,
  labels,
  drilldown = {},
  cellSize: cellSizeProp,
  showValues = true,
}: CorrelationRippleMatrixProps) {
  const [active, setActive] = useState<CellData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(cellSizeProp ?? 24);

  useEffect(() => {
    if (cellSizeProp !== undefined) return;
    const update = () => {
      if (containerRef.current) {
        setCellSize(containerRef.current.clientWidth / labels.length);
      }
    };
    update();
    const observer = new ResizeObserver(() => update());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [cellSizeProp, labels.length]);

  const heatData: CellData[] = matrix.flatMap((row, y) =>
    row.map((value, x) => ({ x, y, value }))
  );

  const handleCellClick = (cell: CellData) => {
    setActive(cell);
  };

  const activeKey = active ? `${active.y}-${active.x}` : null;
  const chartData = activeKey && drilldown[activeKey] ? drilldown[activeKey] : [];

  return (
    <div ref={containerRef} className="relative w-full aspect-square">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <XAxis
            type="number"
            dataKey="x"
            tickFormatter={(i) => labels[i] || ""}
            ticks={labels.map((_, i) => i)}
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={{ angle: -45, textAnchor: "end", dy: 8, dx: -5 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            tickFormatter={(i) => labels[i] || ""}
            ticks={labels.map((_, i) => i)}
            interval={0}
            tickLine={false}
            axisLine={false}
          />
          <Scatter
            data={heatData}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const x = cx - cellSize / 2;
              const y = cy - cellSize / 2;
              return (
                <g>
                  <Rectangle
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    fill={colorScale(payload.value)}
                    stroke="#ffffff"
                    onClick={() => handleCellClick(payload as CellData)}
                    cursor="pointer"
                  />
                  {showValues && (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      pointerEvents="none"
                      className="fill-black text-[10px]"
                    >
                      {payload.value.toFixed(2)}
                    </text>
                  )}
                </g>
              );
            }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const cell = payload[0].payload as CellData;
                const xLabel = labels[cell.x] ?? "";
                const yLabel = labels[cell.y] ?? "";
                return (
                  <div className="bg-white p-2 border rounded shadow">
                    <div className="font-medium">{`${xLabel} vs ${yLabel}`}</div>
                    <div>{cell.value.toFixed(2)}</div>
                  </div>
                );
              }
              return null;
            }}
          />
        </ScatterChart>
      </ResponsiveContainer>
      {active && chartData.length > 0 && (
        <div
          className="absolute bg-white border p-2 rounded shadow"
          style={{
            left: active.x * cellSize + cellSize / 2,
            top: active.y * cellSize + cellSize / 2,
            transform: "translate(-50%, -50%)",
            animation: "ripple 0.3s ease-out",
            pointerEvents: "auto",
          }}
          onClick={() => setActive(null)}
        >
          <LineChart width={150} height={80} data={chartData}>
            <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
            <Tooltip />
          </LineChart>
        </div>
      )}
      <style>{`
        @keyframes ripple {
          from { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

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
import { scaleDiverging } from "d3-scale";
import { interpolateRdBu, interpolatePRGn } from "d3-scale-chromatic";

interface CorrelationRippleMatrixProps {
  matrix: number[][]; // correlation values between -1 and 1
  labels: string[]; // axis labels
  drilldown?: Record<string, { x: number; y: number }[]>; // optional mini chart data
  groups?: { label: string; size: number }[]; // metric groups for background bands

  minValue?: number; // lower bound for color scale
  maxValue?: number; // upper bound for color scale
  showValues?: boolean; // display correlation values in cells
  cellSize?: number; // explicit cell size override
  maxCellSize?: number; // maximum computed cell size
  upperOnly?: boolean; // only render x >= y cells
  palette?: "default" | "colorblind"; // color scheme for visualization
}

interface CellData {
  x: number; // column index
  y: number; // row index
  value: number;
}


const DEFAULT_CELL_SIZE = 24;

/**
 * Create a diverging color scale that maps `minValue` → negative hue,
 * `0` → white, and `maxValue` → positive hue. The palette can be
 * switched between the default red/blue (`interpolateRdBu`) and a
 * color-blind-friendly purple/green (`interpolatePRGn`) scheme.
 * Values outside the [minValue, maxValue] range are clamped.
 */
function createColorScale(
  minValue = -1,
  maxValue = 1,
  palette: "default" | "colorblind" = "default"
) {
  const interpolator =
    palette === "colorblind"
      ? (t: number) => interpolatePRGn(1 - t)
      : (t: number) => interpolateRdBu(1 - t);

  return scaleDiverging(interpolator)
    .domain([minValue, 0, maxValue])
    .clamp(true);
}

export default function CorrelationRippleMatrix({
  matrix,
  labels,
  groups,
  drilldown = {},

  minValue = -1,
  maxValue = 1,
  showValues = false,
  cellSize: cellSizeProp,
  maxCellSize,
  upperOnly = false,
  palette = "default",

}: CorrelationRippleMatrixProps) {
  const [active, setActive] = useState<CellData | null>(null);
  const [hovered, setHovered] = useState<CellData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(cellSizeProp ?? DEFAULT_CELL_SIZE);

  const groupBounds = groups
    ? groups.reduce<{ label: string; size: number; start: number }[]>(
        (acc, g) => {
          const start = acc.length
            ? acc[acc.length - 1].start + acc[acc.length - 1].size
            : 0;
          acc.push({ ...g, start });
          return acc;
        },
        [],
      )
    : [];

  useEffect(() => {
    if (cellSizeProp !== undefined) return;
    const update = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const computedSize = containerWidth / labels.length;
        const size =
          maxCellSize !== undefined
            ? Math.min(maxCellSize, computedSize)
            : computedSize;
        setCellSize(size);
      }
    };
    update();
    const observer = new ResizeObserver(() => update());
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [cellSizeProp, labels.length, maxCellSize]);

  const heatData: CellData[] = matrix
    .flatMap((row, y) => row.map((value, x) => ({ x, y, value })))
    .filter(({ x, y }) => !upperOnly || x >= y);

  const colorScale = createColorScale(minValue, maxValue, palette);

  const handleCellClick = (cell: CellData) => {
    setActive(cell);
  };

  const activeKey = active ? `${active.y}-${active.x}` : null;
  const chartData = activeKey && drilldown[activeKey] ? drilldown[activeKey] : [];

  // Legend reflects the selected palette across the value range
  const legendGradient = `linear-gradient(to right, ${colorScale(
    minValue
  )}, ${colorScale(0)}, ${colorScale(maxValue)})`;
  const minLabel = Number(minValue).toFixed(1);
  const maxLabel = Number(maxValue).toFixed(1);

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative w-full aspect-square">
        {groupBounds.length > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {groupBounds.map((g, i) => (
              <g key={g.label}>
                <rect
                  x={g.start * cellSize}
                  y={0}
                  width={g.size * cellSize}
                  height={labels.length * cellSize}
                  fill={i % 2 === 0 ? "#000" : "#fff"}
                  opacity={0.03}
                />
                <rect
                  x={0}
                  y={g.start * cellSize}
                  width={labels.length * cellSize}
                  height={g.size * cellSize}
                  fill={i % 2 === 0 ? "#000" : "#fff"}
                  opacity={0.03}
                />
              </g>
            ))}
            {groupBounds.slice(1).map((g, i) => (
              <g key={`line-${i}`}>
                <line
                  x1={g.start * cellSize}
                  x2={g.start * cellSize}
                  y1={0}
                  y2={labels.length * cellSize}
                  stroke="#bbb"
                  strokeWidth={1}
                />
                <line
                  x1={0}
                  x2={labels.length * cellSize}
                  y1={g.start * cellSize}
                  y2={g.start * cellSize}
                  stroke="#bbb"
                  strokeWidth={1}
                />
              </g>
            ))}
          </svg>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            onMouseLeave={() => setHovered(null)}
          >
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
              const isHighlighted =
                hovered && (hovered.x === payload.x || hovered.y === payload.y);
              const opacity = hovered ? (isHighlighted ? 1 : 0.3) : 1;
              return (
                <g>
                  <Rectangle
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    fill={colorScale(payload.value)}
                    stroke="#ffffff"
                    opacity={opacity}
                    onClick={() => handleCellClick(payload as CellData)}
                    onMouseOver={() => setHovered(payload as CellData)}
                    onMouseOut={() => setHovered(null)}
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
                      opacity={opacity}
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
      <div className="mt-2">
        <div
          className="h-2 w-full rounded"
          style={{ background: legendGradient }}
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
          <span>{minLabel}</span>
          <span>0</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

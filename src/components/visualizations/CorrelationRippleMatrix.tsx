"use client";

import { useEffect, useRef, useState } from "react";
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Rectangle,
  Tooltip,
} from "recharts";
import { scaleDiverging } from "d3-scale";
import { interpolateHcl } from "d3-interpolate";
import CorrelationDetails from "./CorrelationDetails";

interface CorrelationRippleMatrixProps {
  matrix: number[][]; // correlation values between -1 and 1
  labels: string[]; // axis labels
  drilldown?: Record<string, { x: number; y: number; date?: string }[]>; // optional detailed data

  minValue?: number; // lower bound for color scale
  maxValue?: number; // upper bound for color scale
  showValues?: boolean; // display correlation values in cells
  cellSize?: number; // explicit cell size override
  maxCellSize?: number; // maximum computed cell size
  upperOnly?: boolean; // only render x >= y cells

}

interface CellData {
  x: number; // column index
  y: number; // row index
  value: number;
}


const DEFAULT_CELL_SIZE = 24;

/**
 * Create a perceptually uniform diverging scale mapping:
 *   minValue → blue (#2166ac),
 *   0       → white (#ffffff),
 *   maxValue → red (#b2182b).
 * Colors are interpolated in HCL space for smoother perception.
 * The returned scale clamps values outside the [minValue, maxValue] range.
 */
function createColorScale(minValue = -1, maxValue = 1) {
  const blue = "#2166ac";
  const white = "#ffffff";
  const red = "#b2182b";

  const interpolator = (t: number) =>
    t < 0.5
      ? interpolateHcl(blue, white)(t * 2)
      : interpolateHcl(white, red)((t - 0.5) * 2);

  return scaleDiverging(interpolator)
    .domain([minValue, 0, maxValue])
    .clamp(true);
}

export default function CorrelationRippleMatrix({
  matrix,
  labels,
  drilldown = {},

  minValue = -1,
  maxValue = 1,
  showValues = false,
  cellSize: cellSizeProp,
  maxCellSize,
  upperOnly = false,

}: CorrelationRippleMatrixProps) {
  const [active, setActive] = useState<CellData | null>(null);
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [hovered, setHovered] = useState<CellData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(cellSizeProp ?? DEFAULT_CELL_SIZE);

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

  const colorScale = createColorScale(minValue, maxValue);

  const handleCellClick = (cell: CellData) => {
    setActive(cell);
    setOpen(true);
  };

  const activeKey = active ? `${active.y}-${active.x}` : null;
  const chartData = activeKey && drilldown[activeKey] ? drilldown[activeKey] : [];

  const legendGradient = `linear-gradient(to right, ${colorScale(
    minValue
  )}, ${colorScale(0)}, ${colorScale(maxValue)})`;
  const minLabel = Number(minValue).toFixed(1);
  const maxLabel = Number(maxValue).toFixed(1);

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative w-full aspect-square">
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
      </div>
      <CorrelationDetails
        open={open && !!active}
        onOpenChange={(o) => {
          if (pinned && !o) return;
          setOpen(o);
          if (!o) {
            setActive(null);
            setPinned(false);
          }
        }}
        xLabel={active ? labels[active.x] : ""}
        yLabel={active ? labels[active.y] : ""}
        data={chartData}
        pinned={pinned}
        onPinChange={setPinned}
      />
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

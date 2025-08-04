"use client";

import { useEffect, useId, useRef, useState } from "react";
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
import { interpolateHcl } from "d3-interpolate";

interface DrilldownData {
  data: { x: number; y: number }[];
  pValue?: number;
  insight?: string;
}

interface CorrelationRippleMatrixProps {
  matrix: number[][]; // correlation values between -1 and 1
  labels: string[]; // axis labels
  drilldown?: Record<string, DrilldownData>; // optional mini chart data

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

function defaultInsight(value: number): string {
  const abs = Math.abs(value);
  if (abs > 0.7) {
    return value > 0 ? "Strong positive correlation" : "Strong negative correlation";
  }
  if (abs > 0.3) {
    return value > 0 ? "Moderate positive correlation" : "Moderate negative correlation";
  }
  return "Weak or no correlation";
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
  const [hovered, setHovered] = useState<CellData | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(cellSizeProp ?? DEFAULT_CELL_SIZE);
  const tooltipId = useId();

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
  };

  const handleHover = (cell: CellData | null) => {
    setHovered(cell);
    if (cell) {
      setTooltipPos({
        x: cell.x * cellSize + cellSize / 2 + 20,
        y: cell.y * cellSize + 20,
      });
    } else {
      setTooltipPos(null);
    }
  };

  const activeKey = active ? `${active.y}-${active.x}` : null;
  const chartData = activeKey && drilldown[activeKey] ? drilldown[activeKey].data : [];

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
            onMouseLeave={() => handleHover(null)}
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
              const xLabel = labels[payload.x] ?? "";
              const yLabel = labels[payload.y] ?? "";
              return (
                <g
                  onClick={() => handleCellClick(payload as CellData)}
                  onMouseOver={() => handleHover(payload as CellData)}
                  onMouseOut={() => handleHover(null)}
                  onFocus={() => handleHover(payload as CellData)}
                  onBlur={() => handleHover(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCellClick(payload as CellData);
                    }
                  }}
                  cursor="pointer"
                  tabIndex={0}
                  aria-label={`${xLabel} vs ${yLabel} correlation ${payload.value.toFixed(2)}`}
                  aria-describedby={tooltipId}
                >
                  <Rectangle
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    fill={colorScale(payload.value)}
                    stroke="#ffffff"
                    opacity={opacity}
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
            wrapperStyle={{ pointerEvents: "none" }}
            position={tooltipPos ?? undefined}
            active={!!hovered}
            payload={hovered ? [{ payload: hovered }] : []}
            content={() => {
              if (!hovered) return null;
              const cell = hovered;
              const key = `${cell.y}-${cell.x}`;
              const detail = drilldown[key];
              const xLabel = labels[cell.x] ?? "";
              const yLabel = labels[cell.y] ?? "";
              const pVal = detail?.pValue;
              const insight = detail?.insight ?? defaultInsight(cell.value);
              const miniData = detail?.data ?? [];
              return (
                <div
                  id={tooltipId}
                  role="tooltip"
                  aria-label={`${xLabel} vs ${yLabel} correlation details`}
                  className="bg-white p-2 border rounded shadow text-xs"
                >
                  <div className="font-medium text-sm mb-1">{`${xLabel} vs ${yLabel}`}</div>
                  <div className="mb-1">
                    r = {cell.value.toFixed(2)}
                    {pVal !== undefined && <span className="ml-1">p={pVal.toPrecision(2)}</span>}
                  </div>
                  {miniData.length > 0 && (
                    <LineChart
                      width={120}
                      height={50}
                      data={miniData}
                      aria-label="sparkline"
                    >
                      <Line type="monotone" dataKey="y" stroke="#8884d8" dot={false} />
                    </LineChart>
                  )}
                  <div className="mt-1">{insight}</div>
                </div>
              );
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

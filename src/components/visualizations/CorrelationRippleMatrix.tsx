"use client";

import { useEffect, useRef, useState, lazy, Suspense } from "react";
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
import {
  interpolateRdBu,
  interpolatePRGn,
  interpolateViridis,
  interpolateMagma,
} from "d3-scale-chromatic";
import { rgb } from "d3-color";

interface CorrelationCell {
  value: number; // correlation value between -1 and 1
  n: number; // sample size
  p: number; // p-value
  sparkline?: number[]; // optional rolling correlation values
}

interface CorrelationRippleMatrixProps {
  matrix: CorrelationCell[][]; // correlation values and stats
  labels: string[]; // axis labels
  drilldown?: Record<string, { x: number; y: number }[]>; // optional mini chart data
  groups?: { label: string; size: number }[]; // metric groups for background bands

  minValue?: number; // lower bound for color scale
  maxValue?: number; // upper bound for color scale
  showValues?: boolean; // display correlation values in cells (default: true)
  cellSize?: number; // explicit cell size override
  maxCellSize?: number; // maximum computed cell size
  displayMode?: "upper" | "lower" | "full"; // which part of the matrix to display
  palette?: PaletteOption; // color scheme for visualization
  cellGap?: number; // gap or border width between cells
  signFilter?: "all" | "positive" | "negative"; // filter by correlation sign
  threshold?: number; // minimum absolute correlation value
  topN?: number; // show only top-N strongest correlations
}

interface CellData extends CorrelationCell {
  x: number; // column index
  y: number; // row index
}


type PaletteOption = "default" | "colorblind" | "viridis" | "magma";

const PALETTE_INTERPOLATORS: Record<PaletteOption, (t: number) => string> = {
  default: (t) => interpolateRdBu(1 - t),
  colorblind: (t) => interpolatePRGn(1 - t),
  viridis: interpolateViridis,
  magma: interpolateMagma,
};

const DEFAULT_CELL_SIZE = 24;
const DetailChart = lazy(() => import("./CorrelationDetailChart"));

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
  palette: PaletteOption = "default",
) {
  const interpolator =
    PALETTE_INTERPOLATORS[palette] ?? PALETTE_INTERPOLATORS.default;

  return scaleDiverging(interpolator)
    .domain([minValue, 0, maxValue])
    .clamp(true);
}

function wrapText(label: string, maxChars = 10) {
  const words = label.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const testLine = current ? `${current} ${word}` : word;
    if (testLine.length <= maxChars) {
      current = testLine;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function getTextColor(background: string) {
  const { r, g, b } = rgb(background);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.5 ? "#000" : "#fff";
}

interface LegendProps {
  colorScale: (value: number) => string
  minValue: number
  maxValue: number
}

function Legend({ colorScale, minValue, maxValue }: LegendProps) {
  const gradient = `linear-gradient(to right, ${colorScale(minValue)}, ${colorScale(0)}, ${colorScale(maxValue)})`
  const ticks = [minValue, -0.5, 0, 0.5, maxValue].filter(
    (v, i, arr) => v >= minValue && v <= maxValue && arr.indexOf(v) === i,
  )

  return (
    <div className="mt-4 mx-auto flex w-full max-w-xs flex-col items-center">
      <div
        data-testid="legend-gradient"
        className="relative h-2 w-full rounded"
        style={{ background: gradient }}
      >
        {ticks
          .filter((v) => v !== minValue && v !== maxValue)
          .map((v) => {
            const left = ((v - minValue) / (maxValue - minValue)) * 100
            return (
              <div
                key={`tick-${v}`}
                className="absolute top-full h-2 w-px bg-muted-foreground"
                style={{ left: `${left}%`, transform: "translateX(-50%)" }}
              />
            )
          })}
      </div>
      <div className="relative mt-1 h-4 w-full">
        {ticks.map((v) => {
          const left = ((v - minValue) / (maxValue - minValue)) * 100
          return (
            <span
              key={`label-${v}`}
              className="absolute text-[10px] text-muted-foreground"
              style={{ left: `${left}%`, transform: "translateX(-50%)" }}
            >
              {v.toFixed(1)}
            </span>
          )
        })}
      </div>
      <div className="mt-1 grid w-full grid-cols-3 text-[10px]">
        <span className="justify-self-start">Strong Negative</span>
        <span className="justify-self-center">No Correlation</span>
        <span className="justify-self-end">Strong Positive</span>
      </div>
      <div className="mt-1 text-[10px] text-muted-foreground">Pearson r</div>
    </div>
  )
}

export default function CorrelationRippleMatrix({
  matrix,
  labels,
  groups,
  drilldown = {},

  minValue = -1,
  maxValue = 1,
  showValues = true,
  cellSize: cellSizeProp,
  maxCellSize,
  displayMode = "upper",
  palette = "default",
  cellGap = 1,
  signFilter = "all",
  threshold = 0,
  topN,

}: CorrelationRippleMatrixProps) {
  const [active, setActive] = useState<CellData | null>(null);
  const [hovered, setHovered] = useState<CellData | null>(null);
  const [pinned, setPinned] = useState<CellData | null>(null);
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

  let heatData: CellData[] = matrix
    .flatMap((row, y) => row.map((cell, x) => ({ x, y, ...cell })))
    .filter(({ x, y }) => {
      if (displayMode === "upper") return x >= y;
      if (displayMode === "lower") return x <= y;
      return true;
    });

  heatData = heatData.filter((cell) => {
    if (signFilter === "positive" && cell.value <= 0) return false;
    if (signFilter === "negative" && cell.value >= 0) return false;
    if (Math.abs(cell.value) < threshold) return false;
    return true;
  });

  if (topN !== undefined && topN > 0) {
    heatData = heatData
      .slice()
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, topN);
  }

  const colorScale = createColorScale(minValue, maxValue, palette);

  const handleCellClick = (cell: CellData) => {
    const same = pinned && pinned.x === cell.x && pinned.y === cell.y;
    if (same) {
      setActive(null);
      setPinned(null);
    } else {
      setActive(cell);
      setPinned(cell);
    }
  };

  const activeKey = active ? `${active.y}-${active.x}` : null;
  const chartData = activeKey && drilldown[activeKey] ? drilldown[activeKey] : [];

  // Legend reflects the selected palette across the value range

  const renderXAxisTick = ({ x, y, payload }: any) => {
    const label = labels[payload.value] ?? "";
    const lines = wrapText(label);
    const rotate = lines.length === 1 && label.length > 10;
    return (
      <g transform={`translate(${x},${y})`}>
        {rotate ? (
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="end"
            transform="rotate(-45)"
            title={label}
          >
            {label}
          </text>
        ) : (
          <text
            x={0}
            y={0}
            dy={16 - (lines.length - 1) * 6}
            textAnchor="middle"
            title={label}
          >
            {lines.map((line, idx) => (
              <tspan key={idx} x={0} dy={idx === 0 ? 0 : 12}>
                {line}
              </tspan>
            ))}
          </text>
        )}
      </g>
    );
  };

  const renderYAxisTick = ({ x, y, payload }: any) => {
    const label = labels[payload.value] ?? "";
    const lines = wrapText(label);
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={-5} y={0} textAnchor="end" dominantBaseline="central" title={label}>
          {lines.map((line, idx) => (
            <tspan key={idx} x={-5} dy={idx === 0 ? 0 : 12}>
              {line}
            </tspan>
          ))}
        </text>
      </g>
    );
  };

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
            ticks={labels.map((_, i) => i)}
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={renderXAxisTick}
          />
          <YAxis
            type="number"
            dataKey="y"
            ticks={labels.map((_, i) => i)}
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={renderYAxisTick}
          />
          <Scatter
            data={heatData}
            shape={(props: any) => {
              const { cx, cy, payload } = props;
              const x = cx - cellSize / 2;
              const y = cy - cellSize / 2;
              const xLabel = labels[payload.x] ?? "";
              const yLabel = labels[payload.y] ?? "";
              const highlight = hovered || pinned;
              const isHighlighted =
                highlight && (highlight.x === payload.x || highlight.y === payload.y);
              const significant = payload.p < 0.05;
              const baseOpacity = significant ? 1 : 0.2;
              const opacity = highlight
                ? isHighlighted
                  ? baseOpacity
                  : baseOpacity * 0.3
                : baseOpacity;
              const fillColor = colorScale(payload.value);
              const textColor = getTextColor(fillColor);
              const spark = payload.sparkline as number[] | undefined;
              const xStep = spark && spark.length > 1 ? cellSize / (spark.length - 1) : 0;
              const sparkPoints =
                spark && spark.length > 1
                  ? spark
                      .map((v: number, i: number) => {
                        const sx = x + i * xStep;
                        const sy = y + (1 - (v + 1) / 2) * cellSize;
                        return `${sx},${sy}`;
                      })
                      .join(" ")
                  : "";
              return (
                <g>
                  <Rectangle
                    x={x}
                    y={y}
                    width={cellSize}
                    height={cellSize}
                    fill={fillColor}
                    stroke={cellGap > 0 ? "#f0f0f0" : undefined}
                    strokeWidth={cellGap}
                    opacity={opacity}
                    onClick={() => handleCellClick(payload as CellData)}
                    onMouseOver={() => setHovered(payload as CellData)}
                    onMouseOut={() => setHovered(null)}
                    cursor="pointer"
                    tabIndex={0}
                    aria-label={`${xLabel} vs ${yLabel}: ${payload.value.toFixed(2)}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleCellClick(payload as CellData);
                      }
                    }}
                  />
                  {spark && spark.length > 1 && (
                    <polyline
                      points={sparkPoints}
                      fill="none"
                      stroke={textColor}
                      strokeWidth={1}
                      opacity={opacity}
                      pointerEvents="none"
                    />
                  )}
                  {showValues && (
                    <text
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      pointerEvents="none"
                      fill={textColor}
                      className="text-[10px]"
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
                      <div>r = {cell.value.toFixed(2)}</div>
                      <div>n = {cell.n}</div>
                      <div>p = {cell.p.toExponential(2)}</div>
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
            data-testid="detail-chart"
            className="absolute bg-white border p-2 rounded shadow"
            style={{
              left: active.x * cellSize + cellSize / 2,
              top: active.y * cellSize + cellSize / 2,
              transform: "translate(-50%, -50%)",
              animation: "ripple 0.3s ease-out",
              pointerEvents: "auto",
            }}
            onClick={() => {
              setActive(null);
              setPinned(null);
            }}
          >
            <Suspense fallback={<div className="p-2 text-xs">Loading...</div>}>
              <DetailChart data={chartData} />
            </Suspense>
          </div>
        )}
        <style>{`
          @keyframes ripple {
            from { transform: translate(-50%, -50%) scale(0.2); opacity: 0; }
            to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          }
        `}</style>
      </div>
      <Legend colorScale={colorScale} minValue={minValue} maxValue={maxValue} />
    </div>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { hierarchicalCluster, type ClusterNode } from "@/hooks/useCorrelationMatrix";

interface CorrelationRippleMatrixProps {
  matrix: number[][]; // correlation values between -1 and 1
  labels: string[]; // axis labels
  drilldown?: Record<string, { x: number; y: number }[]>; // optional mini chart data

  minValue?: number; // lower bound for color scale
  maxValue?: number; // upper bound for color scale
  showValues?: boolean; // display correlation values in cells
  cellSize?: number; // explicit cell size override
  maxCellSize?: number; // maximum computed cell size
  upperOnly?: boolean; // only render x >= y cells

  showDendrograms?: boolean; // render dendrograms along top/left

}

interface CellData {
  x: number; // column index
  y: number; // row index
  value: number;
}


const DEFAULT_CELL_SIZE = 24;
const DENDROGRAM_SIZE = 20;

interface DendrogramLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

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

function buildDendrogramLines(
  tree: ClusterNode,
  order: number[],
  cellSize: number,
  height: number,
): DendrogramLine[] {
  if (!tree) return [];
  const posByIndex: Record<number, number> = {};
  order.forEach((idx, i) => {
    posByIndex[idx] = i * cellSize + cellSize / 2;
  });
  const maxDist = tree.distance || 1;

  const layout = (node: ClusterNode): { x: number; y: number; lines: DendrogramLine[] } => {
    if (!node.left || !node.right) {
      const idx = node.indices[0];
      const x = posByIndex[idx];
      return { x, y: height, lines: [] };
    }
    const left = layout(node.left);
    const right = layout(node.right);
    const y = height - (node.distance / maxDist) * height;
    const x = (left.x + right.x) / 2;
    const lines: DendrogramLine[] = [
      ...left.lines,
      ...right.lines,
      { x1: left.x, y1: left.y, x2: left.x, y2: y },
      { x1: right.x, y1: right.y, x2: right.x, y2: y },
      { x1: left.x, y1: y, x2: right.x, y2: y },
    ];
    return { x, y, lines };
  };

  return layout(tree).lines;
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
  showDendrograms = false,

}: CorrelationRippleMatrixProps) {
  const { order, tree } = useMemo(() => hierarchicalCluster(matrix), [matrix]);
  const orderedLabels = useMemo(() => order.map((i) => labels[i]), [labels, order]);
  const orderedMatrix = useMemo(
    () => order.map((i) => order.map((j) => matrix[i][j])),
    [matrix, order],
  );
  const orderedDrilldown = useMemo(() => {
    const res: Record<string, { x: number; y: number }[]> = {};
    for (const key of Object.keys(drilldown)) {
      const [y, x] = key.split("-").map(Number);
      const newY = order.indexOf(y);
      const newX = order.indexOf(x);
      if (newY !== -1 && newX !== -1) {
        res[`${newY}-${newX}`] = drilldown[key];
      }
    }
    return res;
  }, [drilldown, order]);

  const [active, setActive] = useState<CellData | null>(null);
  const [hovered, setHovered] = useState<CellData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [cellSize, setCellSize] = useState<number>(cellSizeProp ?? DEFAULT_CELL_SIZE);

  useEffect(() => {
    if (cellSizeProp !== undefined) return;
    const update = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const computedSize = containerWidth / orderedLabels.length;
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
  }, [cellSizeProp, orderedLabels.length, maxCellSize]);
  const heatData: CellData[] = orderedMatrix
    .flatMap((row, y) => row.map((value, x) => ({ x, y, value })))
    .filter(({ x, y }) => !upperOnly || x >= y);

  const dendrogramLines = useMemo(() => {
    if (!showDendrograms) return { top: [], left: [] };
    const lines = buildDendrogramLines(tree, order, cellSize, DENDROGRAM_SIZE);
    const left = lines.map((l) => ({ x1: l.y1, y1: l.x1, x2: l.y2, y2: l.x2 }));
    return { top: lines, left };
  }, [tree, order, cellSize, showDendrograms]);

  const colorScale = createColorScale(minValue, maxValue);

  const handleCellClick = (cell: CellData) => {
    setActive(cell);
  };

  const activeKey = active ? `${active.y}-${active.x}` : null;
  const chartData = activeKey && orderedDrilldown[activeKey] ? orderedDrilldown[activeKey] : [];

  const legendGradient = `linear-gradient(to right, ${colorScale(
    minValue
  )}, ${colorScale(0)}, ${colorScale(maxValue)})`;
  const minLabel = Number(minValue).toFixed(1);
  const maxLabel = Number(maxValue).toFixed(1);

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative w-full aspect-square">
        {showDendrograms && (
          <>
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              width={orderedLabels.length * cellSize}
              height={DENDROGRAM_SIZE}
              style={{ transform: `translateY(-${DENDROGRAM_SIZE}px)` }}
            >
              {dendrogramLines.top.map((l, i) => (
                <line
                  key={`t-${i}`}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="#999"
                />
              ))}
            </svg>
            <svg
              className="absolute top-0 left-0 pointer-events-none"
              width={DENDROGRAM_SIZE}
              height={orderedLabels.length * cellSize}
              style={{ transform: `translateX(-${DENDROGRAM_SIZE}px)` }}
            >
              {dendrogramLines.left.map((l, i) => (
                <line
                  key={`l-${i}`}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="#999"
                />
              ))}
            </svg>
          </>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            onMouseLeave={() => setHovered(null)}
          >
          <XAxis
            type="number"
            dataKey="x"
            tickFormatter={(i) => orderedLabels[i] || ""}
            ticks={orderedLabels.map((_, i) => i)}
            interval={0}
            tickLine={false}
            axisLine={false}
            tick={{ angle: -45, textAnchor: "end", dy: 8, dx: -5 }}
          />
          <YAxis
            type="number"
            dataKey="y"
            tickFormatter={(i) => orderedLabels[i] || ""}
            ticks={orderedLabels.map((_, i) => i)}
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
                  const xLabel = orderedLabels[cell.x] ?? "";
                  const yLabel = orderedLabels[cell.y] ?? "";
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

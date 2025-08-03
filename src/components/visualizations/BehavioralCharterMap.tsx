"use client";

import { useState } from "react";
import { scaleLinear } from "d3-scale";
import { line as d3Line, area as d3Area } from "d3-shape";
import TransitionMatrix from "./TransitionMatrix";

export type Segment = {
  time: string; // ISO timestamp for start of 30 min window
  state: string; // observed state label
  probability: number; // predicted reading probability 0-1
  risk: number; // model risk score 0-1
  ciLow?: number; // lower bound of confidence interval
  ciHigh?: number; // upper bound of confidence interval
  thresholds?: number[]; // optional threshold markers
};

export interface Attribution {
  feature: string;
  score: number;
}

interface BehavioralCharterMapProps {
  day: string;
  segments: Segment[];
  states: string[];
  transitionMatrix?: number[][];
  riskThresholds?: number[];
}

const stateColors: Record<string, string> = {
  reading: "#4ade80",
  writing: "#60a5fa",
  idle: "#f97316",
  other: "#a1a1aa",
};

export default function BehavioralCharterMap({
  day,
  segments,
  states,
  transitionMatrix,
  riskThresholds,
}: BehavioralCharterMapProps) {
  const width = 800;
  const height = 60;
  const overlayHeight = 10;
  const riskHeight = 40;
  const svgHeight = riskHeight + overlayHeight + height;
  const segmentWidth = width / segments.length;

  const probColor = scaleLinear<string>().domain([0, 1]).range(["#e0f2fe", "#1e3a8a"]);
  const riskScale = scaleLinear().domain([0, 1]).range([riskHeight, 0]);

  const riskLine = d3Line<Segment>()
    .defined((d) => d.risk != null)
    .x((_, i) => i * segmentWidth + segmentWidth / 2)
    .y((d) => riskScale(d.risk));

  const riskArea = d3Area<Segment>()
    .defined((d) => d.ciLow != null && d.ciHigh != null)
    .x((_, i) => i * segmentWidth + segmentWidth / 2)
    .y0((d) => riskScale(d.ciLow ?? d.risk))
    .y1((d) => riskScale(d.ciHigh ?? d.risk));

  const [attributions, setAttributions] = useState<Record<number, Attribution[]>>({});
  const [meta, setMeta] = useState<Record<number, { ciLow?: number; ciHigh?: number; thresholds?: number[]; risk?: number }>>({});
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    items: Attribution[];
    meta?: { ciLow?: number; ciHigh?: number; thresholds?: number[]; risk?: number };
  } | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);
  const [date, setDate] = useState(day);
  const [activity, setActivity] = useState("all");

  const handleHover = async (
    idx: number,
    evt: React.MouseEvent<SVGRectElement, MouseEvent>
  ) => {
    if (!attributions[idx] || !meta[idx]) {
      try {
        const res = await fetch(`/api/predictions/${date}`);
        const json = await res.json();
        setAttributions(json.attributions || {});
        setMeta(json.meta || {});
      } catch {
        // ignore fetch errors
      }
    }
    const items = (attributions[idx] || []).slice(0, 3);
    setTooltip({ x: evt.clientX, y: evt.clientY, items, meta: meta[idx] });
  };

  const handleLeave = () => setTooltip(null);

  const legend = states.map((s) => (
    <div key={s} className="flex items-center gap-1 text-xs">
      <span
        className="w-3 h-3 inline-block rounded-sm"
        style={{ background: stateColors[s] || "#ccc" }}
      />
      {s}
    </div>
  ));

  const filteredSegments = activity === "all" ? segments : segments.filter((s) => s.state === activity);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border p-1 text-sm" />
        <select value={activity} onChange={(e) => setActivity(e.target.value)} className="border p-1 text-sm">
          <option value="all">All</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button onClick={() => setShowMatrix((s) => !s)} className="border px-2 py-1 text-sm">
          {showMatrix ? "Hide" : "Show"} Transitions
        </button>
      </div>
      <div className="flex gap-4">{legend}</div>
      <svg width={width} height={svgHeight} className="block">
        {/* risk confidence band */}
        {riskArea(segments) && (
          <path d={riskArea(segments)!} fill="rgba(30,64,175,0.2)" />
        )}
        {/* risk line */}
        {riskLine(segments) && (
          <path d={riskLine(segments)!} stroke="#1e40af" strokeWidth={2} fill="none" />
        )}
        {/* threshold markers */}
        {riskThresholds?.map((t, i) => (
          <line
            key={i}
            x1={0}
            x2={width}
            y1={riskScale(t)}
            y2={riskScale(t)}
            stroke="#ef4444"
            strokeDasharray="4 2"
          />
        ))}
        {filteredSegments.map((seg, i) => (
          <g key={i}>
            <rect
              x={i * segmentWidth}
              y={riskHeight + overlayHeight}
              width={segmentWidth}
              height={height}
              fill={stateColors[seg.state] || stateColors.other}
              onMouseEnter={(e) => handleHover(i, e)}
              onMouseLeave={handleLeave}
            />
            <rect
              x={i * segmentWidth}
              y={riskHeight}
              width={segmentWidth}
              height={overlayHeight}
              fill={probColor(seg.probability)}
            />
          </g>
        ))}
      </svg>
      {tooltip && (
        <div
          className="absolute bg-white border p-2 text-xs"
          style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
        >
          <div className="font-semibold">Top features</div>
          <ul>
            {tooltip.items.map((a, idx) => (
              <li key={idx}>
                {a.feature}: {a.score.toFixed(2)}
              </li>
            ))}
          </ul>
          {tooltip.meta && (
            <div className="mt-1 space-y-1">
              {tooltip.meta.risk !== undefined && (
                <div>Risk: {tooltip.meta.risk.toFixed(2)}</div>
              )}
              {tooltip.meta.ciLow !== undefined && tooltip.meta.ciHigh !== undefined && (
                <div>
                  CI: {tooltip.meta.ciLow.toFixed(2)} - {tooltip.meta.ciHigh.toFixed(2)}
                </div>
              )}
              {tooltip.meta.thresholds && tooltip.meta.thresholds.length > 0 && (
                <div>Thresholds: {tooltip.meta.thresholds.join(", ")}</div>
              )}
            </div>
          )}
        </div>
      )}
      {showMatrix && transitionMatrix && (
        <TransitionMatrix matrix={transitionMatrix} labels={states} />
      )}
    </div>
  );
}


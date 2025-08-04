"use client";

import { useEffect, useState } from "react";
import { scaleLinear } from "d3-scale";
import { line as d3Line, area as d3Area } from "d3-shape";
import { format } from "date-fns";
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

// Updated palette with modern hues
const stateColors: Record<string, string> = {
  reading: "#14b8a6", // teal
  writing: "#8b5cf6", // violet
  idle: "#f59e0b", // amber
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
    segment: Segment;
    meta?: { ciLow?: number; ciHigh?: number; thresholds?: number[]; risk?: number; probability?: number };
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
    const rect = (evt.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
    setTooltip({
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top,
      items,
      segment: segments[idx],
      meta: { ...meta[idx], probability: segments[idx].probability },
    });
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

  const filteredSegments =
    activity === "all" ? segments : segments.filter((s) => s.state === activity);

  // summary calculations
  const totalByState: Record<string, number> = {};
  segments.forEach((s) => {
    totalByState[s.state] = (totalByState[s.state] || 0) + 0.5;
  });
  const maxRiskIdx = segments.reduce(
    (maxIdx, seg, i) => (seg.risk > segments[maxIdx].risk ? i : maxIdx),
    0,
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/predictions/${date}`);
        const json = await res.json();
        setAttributions(json.attributions || {});
        setMeta(json.meta || {});
      } catch {
        // ignore fetch errors
      }
    };
    fetchData();
  }, [date]);

  // find highest risk attribution if available
  const peakAttribution = (attributions[maxRiskIdx] || [])[0];
  const peakX = maxRiskIdx * segmentWidth + segmentWidth / 2;
  const peakY = riskScale(segments[maxRiskIdx].risk);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-1 text-sm"
        />
        <select
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="border p-1 text-sm"
        >
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
      <div className="flex gap-4 text-xs">{legend}</div>
      <div className="relative">
        <svg width={width} height={svgHeight} className="block">
        {/* probability grid */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            x2={width}
            y1={riskHeight + overlayHeight - (i * overlayHeight) / 4}
            y2={riskHeight + overlayHeight - (i * overlayHeight) / 4}
            stroke="#e5e7eb"
            strokeWidth={0.5}
          />
        ))}
        {/* risk confidence band */}
        {riskArea(segments) && (
          <path
            d={riskArea(segments)!}
            fill="rgba(30,64,175,0.2)"
            style={{ transition: "d 0.3s" }}
          />
        )}
        {/* risk line */}
        {riskLine(segments) && (
          <path
            d={riskLine(segments)!}
            stroke="#1e40af"
            strokeWidth={2}
            fill="none"
            style={{ transition: "d 0.3s" }}
          />
        )}
        {/* highest risk marker */}
        <circle
          cx={maxRiskIdx * segmentWidth + segmentWidth / 2}
          cy={riskScale(segments[maxRiskIdx].risk)}
          r={3}
          fill="#ef4444"
        />
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
              stroke="#fff"
              strokeWidth={0.5}
              style={{ transition: "fill 0.3s" }}
              onMouseEnter={(e) => handleHover(i, e)}
              onMouseLeave={handleLeave}
            />
            <rect
              x={i * segmentWidth}
              y={riskHeight}
              width={segmentWidth}
              height={overlayHeight}
              fill={probColor(seg.probability)}
              stroke="#fff"
              strokeWidth={0.5}
              style={{ transition: "fill 0.3s" }}
            />
          </g>
        ))}
        </svg>
        {/* peak risk callout */}
        <div
          className="absolute bg-white border text-xs p-1 rounded shadow"
          style={{ left: peakX + 5, top: peakY - 40 }}
        >
          <div className="font-semibold">
            Peak {segments[maxRiskIdx].risk.toFixed(2)} at {format(
              new Date(segments[maxRiskIdx].time),
              "HH:mm"
            )}
          </div>
          {peakAttribution && (
            <div className="mt-1">{peakAttribution.feature}</div>
          )}
        </div>
        {tooltip && (
          <div
            className="absolute bg-white border p-2 text-xs rounded shadow"
            style={{ left: tooltip.x + 10, top: tooltip.y + 10 }}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                {format(new Date(tooltip.segment.time), "HH:mm")} – {tooltip.segment.state}
              </div>
              <div className="relative w-6 h-6">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(#1e3a8a ${
                      tooltip.segment.probability * 360
                    }deg, #e5e7eb 0deg)`,
                  }}
                />
                <div className="absolute inset-1 bg-white rounded-full text-[10px] flex items-center justify-center">
                  {(tooltip.segment.probability * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            {tooltip.meta && (
              <div className="mt-1">
                <div>Risk: {tooltip.meta.risk?.toFixed(2)}</div>
                {tooltip.meta.ciLow !== undefined && tooltip.meta.ciHigh !== undefined && (
                  <div className="relative w-32 h-2 bg-gray-200 mt-1">
                    <div
                      className="absolute h-full bg-red-300"
                      style={{
                        left: `${(tooltip.meta.ciLow || 0) * 100}%`,
                        width: `${((tooltip.meta.ciHigh || 0) - (tooltip.meta.ciLow || 0)) * 100}%`,
                      }}
                    />
                    {tooltip.meta.risk !== undefined && (
                      <div
                        className="absolute h-full bg-red-600"
                        style={{ left: `${tooltip.meta.risk * 100}%`, width: "2%" }}
                      />
                    )}
                  </div>
                )}
              </div>
            )}
            <div className="mt-1">Top drivers</div>
            <ul className="list-disc pl-4">
              {tooltip.items.map((a, idx) => (
                <li key={idx}>
                  {a.feature}: {a.score.toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {showMatrix && transitionMatrix && (
        <TransitionMatrix matrix={transitionMatrix} labels={states} />
      )}
      <div className="flex gap-4 text-xs">
        <div>
          Highest risk at {format(new Date(segments[maxRiskIdx].time), "HH:mm")}: {segments[
            maxRiskIdx
          ].risk.toFixed(2)}
        </div>
        {states.map((s) => (
          <div key={s}>
            {s}: {totalByState[s] ? totalByState[s].toFixed(1) : 0}h
          </div>
        ))}
      </div>
    </div>
  );
}


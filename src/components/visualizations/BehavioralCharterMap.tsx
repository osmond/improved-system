"use client";

import { useState } from "react";
import { scaleLinear } from "d3-scale";
import TransitionMatrix from "./TransitionMatrix";

export type Segment = {
  time: string; // ISO timestamp for start of 30 min window
  state: string; // observed state label
  probability: number; // predicted reading probability 0-1
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
}: BehavioralCharterMapProps) {
  const width = 800;
  const height = 60;
  const overlayHeight = 10;
  const segmentWidth = width / segments.length;

  const probColor = scaleLinear<string>().domain([0, 1]).range(["#e0f2fe", "#1e3a8a"]);

  const [attributions, setAttributions] = useState<Record<number, Attribution[]>>({});
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    items: Attribution[];
  } | null>(null);
  const [showMatrix, setShowMatrix] = useState(false);
  const [date, setDate] = useState(day);
  const [activity, setActivity] = useState("all");

  const handleHover = async (idx: number, evt: React.MouseEvent<SVGRectElement, MouseEvent>) => {
    if (!attributions[idx]) {
      try {
        const res = await fetch(`/api/predictions/${date}`);
        const json = await res.json();
        setAttributions(json.attributions || {});
      } catch {
        // ignore fetch errors
      }
    }
    const items = (attributions[idx] || []).slice(0, 3);
    setTooltip({ x: evt.clientX, y: evt.clientY, items });
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
      <svg width={width} height={height + overlayHeight} className="block">
        {filteredSegments.map((seg, i) => (
          <g key={i}>
            <rect
              x={i * segmentWidth}
              y={overlayHeight}
              width={segmentWidth}
              height={height}
              fill={stateColors[seg.state] || stateColors.other}
              onMouseEnter={(e) => handleHover(i, e)}
              onMouseLeave={handleLeave}
            />
            <rect
              x={i * segmentWidth}
              y={0}
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
        </div>
      )}
      {showMatrix && transitionMatrix && (
        <TransitionMatrix matrix={transitionMatrix} labels={states} />
      )}
    </div>
  );
}


import React from "react";
import { BehavioralCharterMap, Segment } from "@/components/maps";

const demoSegments: Segment[] = [
  {
    time: "2024-01-01T00:00:00Z",
    state: "reading",
    probability: 0.8,
    risk: 0.2,
    ciLow: 0.1,
    ciHigh: 0.3,
  },
  {
    time: "2024-01-01T00:30:00Z",
    state: "writing",
    probability: 0.5,
    risk: 0.4,
    ciLow: 0.3,
    ciHigh: 0.5,
  },
  {
    time: "2024-01-01T01:00:00Z",
    state: "idle",
    probability: 0.2,
    risk: 0.6,
    ciLow: 0.5,
    ciHigh: 0.7,
    thresholds: [0.5],
  },
  {
    time: "2024-01-01T01:30:00Z",
    state: "reading",
    probability: 0.7,
    risk: 0.3,
    ciLow: 0.2,
    ciHigh: 0.4,
  },
];

const states = ["reading", "writing", "idle"];

export default function BehavioralCharterMapPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Behavioral Charter Map</h1>
      <BehavioralCharterMap
        day="2024-01-01"
        segments={demoSegments}
        states={states}
        riskThresholds={[0.5]}
      />
    </div>
  );
}


import React from "react";
import TrainingEntropyHeatmap from "@/components/dashboard/TrainingEntropyHeatmap";
import PerfVsEnvironmentMatrixExample from "@/components/examples/PerfVsEnvironmentMatrix";
import ActivityByTime from "@/components/statistics/ActivityByTime";
import ReadingProbabilityTimeline from "@/components/dashboard/ReadingProbabilityTimeline";

export default function Heatmaps() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <TrainingEntropyHeatmap />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <PerfVsEnvironmentMatrixExample />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ActivityByTime />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ReadingProbabilityTimeline />
      </div>
    </div>
  );
}

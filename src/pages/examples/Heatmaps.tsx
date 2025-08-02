import React from "react";
import TrainingEntropyHeatmap from "@/components/dashboard/TrainingEntropyHeatmap";
import PerfVsEnvironmentMatrixExample from "@/components/examples/PerfVsEnvironmentMatrix";
import ActivityByTime from "@/components/statistics/ActivityByTime";
import ReadingProbabilityTimeline from "@/components/dashboard/ReadingProbabilityTimeline";
import ChartPreview from "@/components/examples/ChartPreview";

export default function Heatmaps() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <ChartPreview>
        <TrainingEntropyHeatmap />
      </ChartPreview>
      <ChartPreview>
        <PerfVsEnvironmentMatrixExample />
      </ChartPreview>
      <ChartPreview>
        <ActivityByTime />
      </ChartPreview>
      <ChartPreview>
        <ReadingProbabilityTimeline />
      </ChartPreview>
    </div>
  );
}

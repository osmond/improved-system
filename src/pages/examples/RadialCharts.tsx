import React from "react";
import ChartRadialLabel from "@/components/examples/RadialChartLabel";
import ChartRadialText from "@/components/examples/RadialChartText";
import ChartRadialGrid from "@/components/examples/RadialChartGrid";
import ChartPreview from "@/components/examples/ChartPreview";

export default function RadialCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <ChartPreview>
        <ChartRadialLabel />
      </ChartPreview>
      <ChartPreview>
        <ChartRadialText />
      </ChartPreview>
      <ChartPreview>
        <ChartRadialGrid />
      </ChartPreview>
    </div>
  );
}

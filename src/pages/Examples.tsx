import React from "react";
import BarChartExamples from "@/components/examples/BarChartExamples";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import ChartBarInteractive from "@/components/examples/BarChartInteractive";

export default function Examples() {
  return (
    <div className="grid gap-6">
      <AreaChartInteractive />
      <ChartBarInteractive />
      <BarChartExamples />
    </div>
  );
}

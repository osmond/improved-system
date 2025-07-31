import React from "react";
import BarChartExamples from "@/components/examples/BarChartExamples";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";

export default function Examples() {
  return (
    <div className="grid gap-6">
      <AreaChartInteractive />
      <BarChartExamples />
    </div>
  );
}

import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import LineChartInteractive from "@/components/examples/LineChartInteractive";

export default function Examples() {
  return (
    <div className="grid gap-6">
      <AreaChartInteractive />


      <LineChartInteractive />

    </div>
  );
}

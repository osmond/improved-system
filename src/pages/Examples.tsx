import React from "react";
import AreaChartInteractive from "@/components/examples/AreaChartInteractive";
import LineChartInteractive from "@/components/examples/LineChartInteractive";
import BarChartInteractive from "@/components/examples/BarChartInteractive";

export default function Examples() {
  return (
    <div className="grid gap-6">
      <AreaChartInteractive />

      <BarChartInteractive />

      <LineChartInteractive />

    </div>
  );
}

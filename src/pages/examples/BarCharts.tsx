import React from "react";
import BarChartInteractive from "@/components/examples/BarChartInteractive";
import ChartBarDefault from "@/components/examples/BarChartDefault";
import ChartBarHorizontal from "@/components/examples/BarChartHorizontal";
import ChartBarMixed from "@/components/examples/BarChartMixed";
import ChartBarLabelCustom from "@/components/examples/BarChartLabelCustom";
import ShoeUsageChart from "@/components/examples/ShoeUsageChart";
import EquipmentUsageTimeline from "@/components/statistics/EquipmentUsageTimeline";
import PeerBenchmarkBands from "@/components/statistics/PeerBenchmarkBands";
import ChartPreview from "@/components/examples/ChartPreview";

export default function BarCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <ChartPreview>
        <BarChartInteractive />
      </ChartPreview>
      <ChartPreview>
        <ChartBarDefault />
      </ChartPreview>
      <ChartPreview>
        <ChartBarHorizontal />
      </ChartPreview>
      <ChartPreview>
        <ChartBarMixed />
      </ChartPreview>
      <ChartPreview>
        <ChartBarLabelCustom />
      </ChartPreview>
      <ChartPreview>
        <ShoeUsageChart />
      </ChartPreview>
      <ChartPreview>
        <EquipmentUsageTimeline />
      </ChartPreview>
      <ChartPreview>
        <PeerBenchmarkBands />
      </ChartPreview>
    </div>
  );
}

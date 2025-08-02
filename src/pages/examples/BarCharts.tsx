import React from "react";
import BarChartInteractive from "@/components/examples/BarChartInteractive";
import ChartBarDefault from "@/components/examples/BarChartDefault";
import ChartBarHorizontal from "@/components/examples/BarChartHorizontal";
import ChartBarMixed from "@/components/examples/BarChartMixed";
import ChartBarLabelCustom from "@/components/examples/BarChartLabelCustom";
import ShoeUsageChart from "@/components/examples/ShoeUsageChart";
import EquipmentUsageTimeline from "@/components/statistics/EquipmentUsageTimeline";
import PeerBenchmarkBands from "@/components/statistics/PeerBenchmarkBands";

export default function BarCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <BarChartInteractive />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartBarDefault />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartBarHorizontal />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartBarMixed />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ChartBarLabelCustom />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ShoeUsageChart />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <EquipmentUsageTimeline />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <PeerBenchmarkBands />
      </div>
    </div>
  );
}

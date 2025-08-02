import React from "react";
import LineChartInteractive from "@/components/examples/LineChartInteractive";
import TimeInBedChart from "@/components/examples/TimeInBedChart";
import ScatterChartPaceHeartRate from "@/components/examples/ScatterChartPaceHeartRate";
import ReadingStackSplit from "@/components/dashboard/ReadingStackSplit";
import CompactNextGameCard from "@/components/dashboard/CompactNextGameCard";
import RunSoundtrackCardDemo from "@/components/examples/RunSoundtrackCardDemo";

export default function MiscCharts() {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <LineChartInteractive />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <TimeInBedChart />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ScatterChartPaceHeartRate />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <ReadingStackSplit />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <CompactNextGameCard
          homeTeam="Wild"
          awayTeam="Blues"
          date="Sep 30, 2025"
          time="7:00 PM"
          isHome={true}
          countdown="in 2 months"
          accentColor="#006847"
        />
      </div>
      <div className="relative overflow-hidden mb-6 break-inside-avoid">
        <RunSoundtrackCardDemo />
      </div>
    </div>
  );
}

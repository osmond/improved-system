import React from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import DashboardLanding from "@/pages/DashboardLanding";
import MapPlaygroundPage from "@/pages/MapPlayground";
import RouteSimilarityPage from "@/pages/RouteSimilarity";
import RouteNoveltyPage from "@/pages/RouteNovelty";
import MileageGlobePage from "@/pages/MileageGlobe";
import FragilityPage from "@/pages/Fragility";
import ClinicalFragilityDemoPage from "@/pages/ClinicalFragilityDemo";
import SessionSimilarityPage from "@/pages/SessionSimilarity";
import GoodDayPage from "@/pages/GoodDay";
import HabitConsistencyPage from "@/pages/HabitConsistency";
import StatisticsPage from "@/pages/Statistics";
import AreaChartInteractivePage from "@/pages/charts/AreaChartInteractive";
import StepsTrendWithGoalPage from "@/pages/charts/StepsTrendWithGoal";
import AreaChartLoadRatioPage from "@/pages/charts/AreaChartLoadRatio";
import TreadmillVsOutdoorPage from "@/pages/charts/TreadmillVsOutdoor";
import WeeklyVolumeHistoryChartPage from "@/pages/charts/WeeklyVolumeHistoryChart";
import GhostSelfRivalChartPage from "@/pages/charts/GhostSelfRivalChart";
import BarChartInteractivePage from "@/pages/charts/BarChartInteractive";
import BarChartDefaultPage from "@/pages/charts/BarChartDefault";
import BarChartHorizontalPage from "@/pages/charts/BarChartHorizontal";
import BarChartMixedPage from "@/pages/charts/BarChartMixed";
import BarChartLabelCustomPage from "@/pages/charts/BarChartLabelCustom";
import ShoeUsageChartPage from "@/pages/charts/ShoeUsageChart";
import PeerBenchmarkBandsPage from "@/pages/charts/PeerBenchmarkBands";
import TrainingEntropyHeatmapPage from "@/pages/charts/TrainingEntropyHeatmap";
import PerfVsEnvironmentMatrixPage from "@/pages/charts/PerfVsEnvironmentMatrix";
import ActivityByTimePage from "@/pages/charts/ActivityByTime";
import ReadingProbabilityTimelinePage from "@/pages/charts/ReadingProbabilityTimeline";
import LineChartInteractivePage from "@/pages/charts/LineChartInteractive";
import TimeInBedChartPage from "@/pages/charts/TimeInBedChart";
import ScatterChartPaceHeartRatePage from "@/pages/charts/ScatterChartPaceHeartRate";
import ReadingStackSplitPage from "@/pages/charts/ReadingStackSplit";
import CompactNextGameCardPage from "@/pages/charts/CompactNextGameCard";
import RunSoundtrackCardDemoPage from "@/pages/charts/RunSoundtrackCardDemo";
import RadarChartDefaultPage from "@/pages/charts/RadarChartDefault";
import RadarChartWorkoutByTimePage from "@/pages/charts/RadarChartWorkoutByTime";
import MonthlyMileagePatternPage from "@/pages/charts/MonthlyMileagePattern";
import AvgDailyMileageRadarPage from "@/pages/charts/AvgDailyMileageRadar";
import RadialChartLabelPage from "@/pages/charts/RadialChartLabel";
import RadialChartTextPage from "@/pages/charts/RadialChartText";
import RadialChartGridPage from "@/pages/charts/RadialChartGrid";

import FocusHistoryPage from "@/pages/FocusHistory";
import InterventionSettingsPage from "@/pages/InterventionSettings";

import PrivacyDashboardPage from "@/pages/PrivacyDashboard";
import BehavioralCharterMapPage from "@/pages/BehavioralCharterMap";
import SidebarDemoPage from "@/pages/SidebarDemo";
import VisualizationsList from "@/pages/VisualizationsList";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";
import { SelectionProvider } from "@/hooks/useSelection";

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DashboardFiltersProvider>
        <SelectionProvider>
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<VisualizationsList />} />
            <Route path="/visualizations" element={<VisualizationsList />} />
            <Route path="/sidebar-demo" element={<SidebarDemoPage />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardLanding />} />
              <Route path="map" element={<MapPlaygroundPage />} />
              <Route path="route-similarity" element={<RouteSimilarityPage />} />
              <Route path="route-novelty" element={<RouteNoveltyPage />} />
              <Route path="mileage-globe" element={<MileageGlobePage />} />
              <Route path="fragility" element={<FragilityPage />} />
              <Route
                path="clinical-fragility-demo"
                element={<ClinicalFragilityDemoPage />}
              />
              <Route path="session-similarity" element={<SessionSimilarityPage />} />
              <Route path="good-day" element={<GoodDayPage />} />
              <Route path="habit-consistency" element={<HabitConsistencyPage />} />
              <Route path="statistics" element={<StatisticsPage />} />
              <Route path="privacy" element={<PrivacyDashboardPage />} />
              <Route path="charts/area-chart-interactive" element={<AreaChartInteractivePage />} />
              <Route path="charts/steps-trend-with-goal" element={<StepsTrendWithGoalPage />} />
              <Route path="charts/area-chart-load-ratio" element={<AreaChartLoadRatioPage />} />
              <Route path="charts/treadmill-vs-outdoor" element={<TreadmillVsOutdoorPage />} />
              <Route path="charts/weekly-volume-history-chart" element={<WeeklyVolumeHistoryChartPage />} />
              <Route path="charts/ghost-self-rival-chart" element={<GhostSelfRivalChartPage />} />
              <Route path="charts/bar-chart-interactive" element={<BarChartInteractivePage />} />
              <Route path="charts/bar-chart-default" element={<BarChartDefaultPage />} />
              <Route path="charts/bar-chart-horizontal" element={<BarChartHorizontalPage />} />
              <Route path="charts/bar-chart-mixed" element={<BarChartMixedPage />} />
              <Route path="charts/bar-chart-label-custom" element={<BarChartLabelCustomPage />} />
              <Route path="charts/shoe-usage-chart" element={<ShoeUsageChartPage />} />
              <Route path="charts/peer-benchmark-bands" element={<PeerBenchmarkBandsPage />} />
              <Route path="charts/training-entropy-heatmap" element={<TrainingEntropyHeatmapPage />} />
              <Route path="charts/perf-vs-environment-matrix" element={<PerfVsEnvironmentMatrixPage />} />
              <Route path="charts/activity-by-time" element={<ActivityByTimePage />} />
              <Route path="charts/reading-probability-timeline" element={<ReadingProbabilityTimelinePage />} />
              <Route path="charts/line-chart-interactive" element={<LineChartInteractivePage />} />
              <Route path="charts/time-in-bed-chart" element={<TimeInBedChartPage />} />
              <Route path="charts/scatter-chart-pace-heart-rate" element={<ScatterChartPaceHeartRatePage />} />
              <Route path="charts/reading-stack-split" element={<ReadingStackSplitPage />} />
              <Route path="charts/compact-next-game-card" element={<CompactNextGameCardPage />} />
              <Route path="charts/run-soundtrack-card-demo" element={<RunSoundtrackCardDemoPage />} />
              <Route path="charts/radar-chart-default" element={<RadarChartDefaultPage />} />
              <Route path="charts/radar-chart-workout-by-time" element={<RadarChartWorkoutByTimePage />} />
              <Route
                path="charts/monthly-mileage-pattern"
                element={<MonthlyMileagePatternPage />}
              />
              <Route path="charts/avg-daily-mileage-radar" element={<AvgDailyMileageRadarPage />} />
              <Route path="charts/radial-chart-label" element={<RadialChartLabelPage />} />
              <Route path="charts/radial-chart-text" element={<RadialChartTextPage />} />
              <Route path="charts/radial-chart-grid" element={<RadialChartGridPage />} />
              <Route path="focus-history" element={<FocusHistoryPage />} />
              <Route path="settings" element={<InterventionSettingsPage />} />
              <Route path="behavioral-charter-map" element={<BehavioralCharterMapPage />} />
            </Route>
          </Routes>
        </DashboardLayout>
        </SelectionProvider>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import DashboardLanding from "@/pages/DashboardLanding";
import MapPlaygroundPage from "@/pages/MapPlayground";
import RouteSimilarityPage from "@/pages/RouteSimilarity";
import RouteNoveltyPage from "@/pages/RouteNovelty";
import MileageGlobePage from "@/pages/MileageGlobe";
import FragilityPage from "@/pages/Fragility";
import SessionSimilarityPage from "@/pages/SessionSimilarity";
import GoodDayPage from "@/pages/GoodDay";
import HabitConsistencyPage from "@/pages/HabitConsistency";
import AreaCharts from "@/pages/examples/AreaCharts";
import BarCharts from "@/pages/examples/BarCharts";
import RadarCharts from "@/pages/examples/RadarCharts";
import RadialCharts from "@/pages/examples/RadialCharts";
import Heatmaps from "@/pages/examples/Heatmaps";
import MiscCharts from "@/pages/examples/MiscCharts";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";

function App() {
  return (
    <BrowserRouter>
      <DashboardFiltersProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardLanding />} />
              <Route path="map" element={<MapPlaygroundPage />} />
              <Route path="route-similarity" element={<RouteSimilarityPage />} />
              <Route path="route-novelty" element={<RouteNoveltyPage />} />
              <Route path="mileage-globe" element={<MileageGlobePage />} />
              <Route path="fragility" element={<FragilityPage />} />
              <Route path="session-similarity" element={<SessionSimilarityPage />} />
              <Route path="good-day" element={<GoodDayPage />} />
              <Route path="habit-consistency" element={<HabitConsistencyPage />} />
              <Route path="examples/area-charts" element={<AreaCharts />} />
              <Route path="examples/bar-charts" element={<BarCharts />} />
              <Route path="examples/radar-charts" element={<RadarCharts />} />
              <Route path="examples/radial-charts" element={<RadialCharts />} />
              <Route path="examples/heatmaps" element={<Heatmaps />} />
              <Route path="examples/misc-charts" element={<MiscCharts />} />
            </Route>
          </Routes>
        </Layout>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
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
            <Route path="/dashboard/examples/area-charts" element={<AreaCharts />} />
            <Route path="/dashboard/examples/bar-charts" element={<BarCharts />} />
            <Route path="/dashboard/examples/radar-charts" element={<RadarCharts />} />
            <Route path="/dashboard/examples/radial-charts" element={<RadialCharts />} />
            <Route path="/dashboard/examples/heatmaps" element={<Heatmaps />} />
            <Route path="/dashboard/examples/misc-charts" element={<MiscCharts />} />
            <Route path="/dashboard/*" element={<Dashboard />} />
          </Routes>
        </Layout>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

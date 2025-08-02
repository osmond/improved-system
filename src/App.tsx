import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import DashboardHome from "@/pages/DashboardHome";
import MapPlaygroundPage from "@/pages/MapPlayground";
import RouteSimilarityPage from "@/pages/RouteSimilarity";
import RouteNoveltyPage from "@/pages/RouteNovelty";
import Examples from "@/pages/Examples";
import MileageGlobePage from "@/pages/MileageGlobe";
import FragilityPage from "@/pages/Fragility";
import SessionSimilarityPage from "@/pages/SessionSimilarity";
import GoodDayPage from "@/pages/GoodDay";
import HabitConsistencyPage from "@/pages/HabitConsistency";
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
              <Route index element={<DashboardHome />} />
              <Route path="map" element={<MapPlaygroundPage />} />
              <Route path="route-similarity" element={<RouteSimilarityPage />} />
              <Route path="route-novelty" element={<RouteNoveltyPage />} />
              <Route path="examples" element={<Examples />} />
              <Route path="mileage-globe" element={<MileageGlobePage />} />
              <Route path="fragility" element={<FragilityPage />} />
              <Route path="session-similarity" element={<SessionSimilarityPage />} />
              <Route path="good-day" element={<GoodDayPage />} />
              <Route path="habit-consistency" element={<HabitConsistencyPage />} />
            </Route>
          </Routes>
        </Layout>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

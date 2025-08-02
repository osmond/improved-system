import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import MileageGlobePage from "@/pages/MileageGlobe";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";

function App() {
  return (
    <BrowserRouter>
      <DashboardFiltersProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mileage-globe" element={<MileageGlobePage />} />
          </Routes>
        </Layout>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

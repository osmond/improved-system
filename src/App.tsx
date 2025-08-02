import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";
import { dashboardRoutes } from "@/routes";

function App() {
  return (
    <BrowserRouter>
      <DashboardFiltersProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<Navigate to="route-similarity" replace />} />
              {dashboardRoutes.map(({ to, element }) => (
                <Route
                  key={to}
                  path={to.replace("/dashboard/", "")}
                  element={element}
                />
              ))}
            </Route>
          </Routes>
        </Layout>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

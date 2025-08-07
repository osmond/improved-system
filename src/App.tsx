import React, { Suspense } from "react";
import RootLayout from "@/layouts/RootLayout";
import SidebarDemoPage from "@/pages/SidebarDemo";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import VisualizationsList from "@/pages/VisualizationsList";
import { dashboardRoutes } from "@/routes";
import { getLazyComponent } from "@/lib/routeLoader";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";
import { SelectionProvider } from "@/hooks/useSelection";

function createDashboardRoutes() {
  return dashboardRoutes.flatMap(({ items }) =>
    items.map(({ to, component }) => {
      if (!component) return [];
      const LazyComp = getLazyComponent(component);
      return (
        <Route
          key={to}
          path={to}
          element={
            <Suspense fallback={<div>Loading...</div>}>
              <LazyComp />
            </Suspense>
          }
        />
      );
    }),
  );
}

function App() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <DashboardFiltersProvider>
        <SelectionProvider>
          <RootLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/dashboard"
                element={<Navigate to="/" replace />}
              />
              <Route
                path="/visualizations"
                element={<VisualizationsList />}
              />
              <Route path="/sidebar-demo" element={<SidebarDemoPage />} />
              {createDashboardRoutes()}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </RootLayout>
        </SelectionProvider>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

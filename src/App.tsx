import React, { lazy, Suspense } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import DashboardLanding from "@/pages/DashboardLanding";
import SidebarDemoPage from "@/pages/SidebarDemo";
import { dashboardRoutes } from "@/routes";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";
import { SelectionProvider } from "@/hooks/useSelection";

const MissingComponent = () => <div>Component not found</div>;

function createDashboardRoutes() {
  return dashboardRoutes.flatMap(({ items }) =>
    items.map(({ to, component }) => {
      if (!component) return [];
      const LazyComp = lazy(() =>
        import(/* @vite-ignore */ component).catch(() => ({
          default: MissingComponent,
        })),
      );
      const path = to.replace("/dashboard/", "");
      return (
        <Route
          key={path}
          path={path}
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
        <DashboardLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/visualizations"
              element={<Navigate to="/dashboard/all" replace />}
            />
            <Route path="/sidebar-demo" element={<SidebarDemoPage />} />
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<DashboardLanding />} />
              {createDashboardRoutes()}
            </Route>
          </Routes>
        </DashboardLayout>
        </SelectionProvider>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

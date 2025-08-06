import React, { lazy, Suspense } from "react";
import RootLayout from "@/layouts/RootLayout";
import SidebarDemoPage from "@/pages/SidebarDemo";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import VisualizationsList from "@/pages/VisualizationsList";
import { dashboardRoutes } from "@/routes";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";
import { SelectionProvider } from "@/hooks/useSelection";

const MissingComponent = () => <div>Component not found</div>;

const pageModules = import.meta.glob("./pages/**/*.{ts,tsx,js,jsx}");

function createDashboardRoutes() {
  return dashboardRoutes.flatMap(({ items }) =>
    items.map(({ to, component }) => {
      if (!component) return [];
      const path = component.replace("@/", "./");
      const importer =
        pageModules[`${path}.tsx`] ||
        pageModules[`${path}.ts`] ||
        pageModules[`${path}.jsx`] ||
        pageModules[`${path}.js`];
      const LazyComp = importer ? lazy(importer as any) : MissingComponent;
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

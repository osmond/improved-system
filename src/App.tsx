import { Suspense } from "react";
import RootLayout from "@/layouts/RootLayout";
import { dashboardRoutes } from "@/routes";
import { baseRoutes } from "@/routes/baseRoutes";
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
              {baseRoutes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
              <Route
                path="/dashboard"
                element={<Navigate to="/" replace />}
              />
              {createDashboardRoutes()}
            </Routes>
          </RootLayout>
        </SelectionProvider>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

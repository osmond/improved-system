import { Suspense } from "react";
import RootLayout from "@/layouts/RootLayout";
import { generatedRoutes } from "@/routes.generated";
import { baseRoutes } from "@/routes/baseRoutes";
import { getLazyComponent } from "@/lib/routeLoader";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";
import { SelectionProvider } from "@/hooks/useSelection";

function createDashboardRoutes() {
  return generatedRoutes.map(({ path, component }) => {
    const LazyComp = getLazyComponent(component);
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
  });
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

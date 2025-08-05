import React, { lazy, Suspense } from "react";
import RootLayout from "@/layouts/RootLayout";
import SidebarLayout from "@/layouts/SidebarLayout";
import MobileTabLayout from "@/layouts/MobileTabLayout";
import Dashboard from "@/pages/Dashboard";
import DashboardLanding from "@/pages/DashboardLanding";
import SidebarDemoPage from "@/pages/SidebarDemo";
import { dashboardRoutes } from "@/routes";

import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
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
          <RootLayout>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/visualizations"
                element={<Navigate to="/dashboard/all" replace />}
              />
              <Route path="/sidebar-demo" element={<SidebarDemoPage />} />
              <Route path="/dashboard" element={<Dashboard />}>
                <Route
                  element={
                    <>
                      <div className="hidden h-full md:block">
                        <SidebarLayout>
                          <Outlet />
                        </SidebarLayout>
                      </div>
                      <div className="h-full md:hidden">
                        <MobileTabLayout>
                          <Outlet />
                        </MobileTabLayout>
                      </div>
                    </>
                  }
                >
                  <Route index element={<DashboardLanding />} />
                  {createDashboardRoutes()}
                </Route>
              </Route>
            </Routes>
          </RootLayout>
        </SelectionProvider>
      </DashboardFiltersProvider>
    </BrowserRouter>
  );
}

export default App;

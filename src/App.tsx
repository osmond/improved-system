import React from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";

function App() {
  return (
    <DashboardFiltersProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </DashboardFiltersProvider>
  );
}

export default App;

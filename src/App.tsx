import React from "react";
import Layout from "@/components/layout/Layout";
import Home from "@/pages/Home";
import { DashboardFiltersProvider } from "@/hooks/useDashboardFilters";

function App() {
  return (
    <DashboardFiltersProvider>
      <Layout>
        <Home />
      </Layout>
    </DashboardFiltersProvider>
  );
}

export default App;

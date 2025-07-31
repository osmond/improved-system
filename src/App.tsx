import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Examples from "@/pages/Examples";
import Statistics from "@/pages/Statistics";
import GeoActivityExplorer from "@/components/map/GeoActivityExplorer";
import RouteHeatmap from "@/components/map/RouteHeatmap";

function App() {
  const [tab, setTab] = useState("dashboard");
  return (
    <Layout activeTab={tab} setActiveTab={setTab}>
      {tab === "dashboard" && <Dashboard />}
      {tab === "trends" && <p>Trends coming soon...</p>}
      {tab === "map" && (
        <div className="space-y-6">
          <GeoActivityExplorer />
          <RouteHeatmap />
        </div>
      )}
      {tab === "examples" && <Examples />}
      {tab === "statistics" && <Statistics />}
    </Layout>
  );
}

export default App;

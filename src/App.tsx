import React, { useState } from "react";
import Layout from "@/components/layout/Layout";
import Dashboard from "@/pages/Dashboard";
import Examples from "@/pages/Examples";

function App() {
  const [tab, setTab] = useState("dashboard");
  return (
    <Layout activeTab={tab} setActiveTab={setTab}>
      {tab === "dashboard" && <Dashboard />}
      {tab === "trends" && <p>Trends coming soon...</p>}
      {tab === "map" && <p>Map coming soon...</p>}
      {tab === "examples" && <Examples />}
    </Layout>
  );
}

export default App;

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeToggle from "@/components/ui/theme-toggle";

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Layout({
  children,
  activeTab,
  setActiveTab
}: LayoutProps) {
  return (
    <div className="min-h-screen p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Garmin Dashboard</h1>
        <ThemeToggle />
      </header>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="dashboard" onClick={() => setActiveTab("dashboard")}>
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="trends" onClick={() => setActiveTab("trends")}>
            Trends
          </TabsTrigger>
          <TabsTrigger value="map" onClick={() => setActiveTab("map")}>
            Map
          </TabsTrigger>
          <TabsTrigger value="examples" onClick={() => setActiveTab("examples")}>
            Examples
          </TabsTrigger>
          <TabsTrigger value="stats" onClick={() => setActiveTab("stats")}>
            Stats
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-2">{children}</div>
    </div>
  );
}

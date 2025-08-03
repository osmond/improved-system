import React, { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Zap, HeartPulse, Brain, ArrowUp, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface ForecastItem {
  label: string;
  icon: LucideIcon;
  value: number; // today's prediction 0-1
  typical: number; // typical weekly value 0-1
}

const fallbackData: ForecastItem[] = [
  { label: "Energy", icon: Zap, value: 0.72, typical: 0.65 },
  { label: "Recovery", icon: HeartPulse, value: 0.58, typical: 0.6 },
  { label: "Work Focus", icon: Brain, value: 0.81, typical: 0.7 },
];

export default function BehavioralWeatherWidget() {
  const [data, setData] = useState<ForecastItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/behavior-forecast");
        if (!res.ok) throw new Error("network");
        const json = await res.json();
        setData(json);
      } catch {
        // fall back to stubbed data if API call fails
        setData(fallbackData);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <Card className="p-4">
      <h3 className="mb-4 text-sm font-medium">Today's Forecast</h3>
      {loading ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <div className="grid grid-cols-3 gap-4 text-center">
          {data.map((item) => {
            const diff = item.value - item.typical;
            const diffPct = Math.round(diff * 100);
            const DiffIcon = diff >= 0 ? ArrowUp : ArrowDown;
            const diffClass = diff >= 0 ? "text-green-600" : "text-red-600";
            return (
              <div key={item.label} className="flex flex-col items-center gap-1">
                <item.icon className="h-6 w-6" />
                <span className="text-sm">{item.label}</span>
                <span className="text-lg font-semibold">
                  {Math.round(item.value * 100)}%
                </span>
                <span className={`flex items-center text-xs ${diffClass}`}>
                  <DiffIcon className="mr-1 h-3 w-3" />
                  {Math.abs(diffPct)}% vs wk avg
                </span>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}


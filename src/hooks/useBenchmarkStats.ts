import { useState, useEffect } from "react";
import { getBenchmarkStats, BenchmarkStats } from "@/lib/api";

export function useBenchmarkStats(): BenchmarkStats | null {
  const [data, setData] = useState<BenchmarkStats | null>(null);

  useEffect(() => {
    getBenchmarkStats().then(setData);
  }, []);

  return data;
}

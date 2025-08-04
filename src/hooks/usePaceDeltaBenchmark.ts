import { useEffect, useState } from "react";
import { getPaceDeltaBenchmark, type PaceDeltaBenchmark } from "@/lib/api";

export function usePaceDeltaBenchmark(): PaceDeltaBenchmark | null {
  const [data, setData] = useState<PaceDeltaBenchmark | null>(null);

  useEffect(() => {
    getPaceDeltaBenchmark().then(setData);
  }, []);

  return data;
}

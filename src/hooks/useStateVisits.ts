import { useState, useEffect } from "react";
import { getStateVisits } from "@/lib/api";
import type { StateVisit } from "@/lib/types";

export interface UseStateVisitsResult {
  data: StateVisit[] | null;
  isLoading: boolean;
  error: Error | null;
}

export function useStateVisits(): UseStateVisitsResult {
  const [data, setData] = useState<StateVisit[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await getStateVisits();
        if (active) setData(result);
      } catch (e) {
        if (active) setError(e as Error);
      } finally {
        if (active) setIsLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, error };
}

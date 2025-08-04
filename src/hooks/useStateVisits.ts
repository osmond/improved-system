import { useState, useEffect, useCallback } from "react";
import { getStateVisits } from "@/lib/api";
import type { StateVisit } from "@/lib/types";

interface UseStateVisitsResult {
  data: StateVisit[] | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useStateVisits(): UseStateVisitsResult {
  const [data, setData] = useState<StateVisit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchVisits = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getStateVisits();
      if (!result) {
        setError(new Error("Failed to load state visits"));
        setData([]);
      } else {
        setData(result);
      }
    } catch (e) {
      setError(e as Error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  return { data, loading, error, refetch: fetchVisits };
}


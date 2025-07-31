import { useState, useEffect } from "react";
import { getStateVisits } from "@/lib/api";
import type { StateVisit } from "@/lib/types";

export function useStateVisits(): StateVisit[] | null {
  const [data, setData] = useState<StateVisit[] | null>(null);

  useEffect(() => {
    getStateVisits().then(setData);
  }, []);

  return data;
}

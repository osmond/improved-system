import { useEffect, useState } from "react";
import { getLocationVisits, type LocationVisit } from "@/lib/api";

/**
 * React hook that retrieves visits to known locations.
 *
 * It fetches data from {@link getLocationVisits} and exposes a loading flag
 * while the asynchronous call is in progress.
 *
 * @returns An object containing the array of visits and a loading indicator.
 */
export function useLocationVisits() {
  const [visits, setVisits] = useState<LocationVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getLocationVisits()
      .then((data) => {
        if (active) setVisits(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { visits, isLoading };
}

export default useLocationVisits;

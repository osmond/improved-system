import { useEffect, useState } from "react";

/**
 * Detects a "low-end" device using hardware concurrency or device memory
 * and returns true when the visualization should be simplified.
 */
export default function useLowEndDevice(): boolean {
  const [lowEnd, setLowEnd] = useState(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const cores = nav.hardwareConcurrency ?? 4;
    const memory = nav.deviceMemory ?? 4;
    if (cores <= 2 || memory <= 2) {
      setLowEnd(true);
    }
  }, []);

  return lowEnd;
}

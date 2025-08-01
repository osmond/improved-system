import { useEffect, useState } from "react";

export default function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReduced(media.matches);
    update();
    if (media.addEventListener) {
      media.addEventListener("change", update);
    } else {
      // Safari <14
      media.addListener(update);
    }
    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", update);
      } else {
        // Safari <14
        media.removeListener(update);
      }
    };
  }, []);

  return prefersReduced;
}

import { useEffect, useRef, useState } from "react";
import useSocialEngagement from "./useSocialEngagement";

export default function useEngagementNudges() {
  const data = useSocialEngagement();
  const [nudges, setNudges] = useState<string[]>([]);
  const notified = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!data) return;
    const messages: string[] = [];
    if (data.consecutiveHomeDays >= 5) {
      messages.push("Been home 5 days—try a short outing?");
    }
    setNudges(messages);

    messages.forEach((msg) => {
      if (notified.current.has(msg)) return;
      if (typeof window !== "undefined" && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(msg);
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then((perm) => {
            if (perm === "granted") new Notification(msg);
          });
        }
      }
      notified.current.add(msg);
    });
  }, [data]);

  return nudges;
}

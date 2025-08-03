import { useEffect, useRef, useState } from "react";
import useSocialEngagement from "./useSocialEngagement";
import useInterventionPreferences from "./useInterventionPreferences";
import useFocusHistory from "./useFocusHistory";

export default function useEngagementNudges() {
  const data = useSocialEngagement();
  const { prefs } = useInterventionPreferences();
  const { addEvent } = useFocusHistory();
  const [nudges, setNudges] = useState<string[]>([]);
  const notified = useRef<Set<string>>(new Set());
  const timers = useRef<Record<string, number>>({});

  useEffect(() => {
    if (!data) return;
    const messages: string[] = [];
    if (data.consecutiveHomeDays >= 5) {
      messages.push("Been home 5 days—try a short outing?");
    }
    setNudges(messages);

    Object.values(timers.current).forEach((id) => clearTimeout(id));
    timers.current = {};

    messages.forEach((msg) => {
      addEvent({ type: "detection", message: msg });
      if (!prefs.remindersEnabled || notified.current.has(msg)) return;
      const delay = prefs.delayMinutes * 60 * 1000;
      const id = window.setTimeout(() => {
        if (typeof window !== "undefined" && "Notification" in window) {
          if (Notification.permission === "granted") {
            new Notification(msg);
          } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then((perm) => {
              if (perm === "granted") new Notification(msg);
            });
          }
        }
        addEvent({ type: "intervention", message: msg });
        notified.current.add(msg);
      }, delay);
      timers.current[msg] = id;
    });
  }, [data, prefs, addEvent]);

  return nudges;
}

import { useEffect, useState } from 'react';
import { getKindleSessions } from '@/lib/api';

export default function useReadingSessions() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setIsLoading(true);

    async function load() {
      try {
        const d = await getKindleSessions(signal);
        if (!signal.aborted) setData(d);
      } catch (err) {
        if (err.name !== 'AbortError' && !signal.aborted) {
          setError(err);
        }
      } finally {
        if (!signal.aborted) setIsLoading(false);
      }
    }

    load();

    return () => controller.abort();
  }, []);

  return { data, error, isLoading };
}

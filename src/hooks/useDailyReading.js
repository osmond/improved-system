import { useEffect, useState } from 'react';
import { getDailyReadingStats } from '@/lib/api';

export default function useDailyReading(enabled = true) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!enabled) return;
    getDailyReadingStats()
      .then(setData)
      .catch(setError);
  }, [enabled]);

  return { data, error, isLoading: enabled && !data && !error };
}

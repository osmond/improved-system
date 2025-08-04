import { useEffect, useState } from 'react';
import { getDailyReadingStats } from '@/lib/api';

export default function useDailyReading() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDailyReadingStats()
      .then(setData)
      .catch(setError);
  }, []);

  return { data, error, isLoading: !data && !error };
}

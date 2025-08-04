import { useEffect, useState } from 'react';
import { getKindleSessions } from '@/lib/api';

export default function useReadingSessions() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getKindleSessions().then(setData).catch(setError);
  }, []);

  return { data, error, isLoading: !data && !error };
}

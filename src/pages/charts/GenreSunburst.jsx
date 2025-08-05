import React, { useEffect, useState } from 'react';
import GenreSunburst from '@/components/genre/GenreSunburst.jsx';

export default function GenreSunburstPage() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/kindle/genre-hierarchy')
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, []);
  if (!data) return <div>Loading...</div>;
  return (
    <div className="p-4">
      <GenreSunburst data={data} />
    </div>
  );
}

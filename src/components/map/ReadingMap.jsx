import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker } from 'react-leaflet';

export default function ReadingMap() {
  const [locations, setLocations] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetch('/api/kindle/locations')
      .then((res) => res.json())
      .then(setLocations)
      .catch(() => setLocations([]));
  }, []);

  const filtered = useMemo(() => {
    return locations.filter((l) => {
      if (start && l.start < start) return false;
      if (end && l.start > end) return false;
      if (title && !l.title.toLowerCase().includes(title.toLowerCase())) return false;
      return true;
    });
  }, [locations, start, end, title]);

  const center = filtered[0]
    ? [filtered[0].latitude, filtered[0].longitude]
    : [0, 0];

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
        />
        <input
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
        <input
          type="text"
          placeholder="Book title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>
      <MapContainer center={center} zoom={2} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered.map((loc, idx) => (
          <CircleMarker
            key={idx}
            center={[loc.latitude, loc.longitude]}
            radius={5}
            pathOptions={{ color: 'red' }}
          />
        ))}
      </MapContainer>
    </div>
  );
}

import React, { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import locationsData from '@/data/kindle/locations.json';

export default function ReadingMap() {
  const [locations, setLocations] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [title, setTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    setLocations(
      [...locationsData].sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      )
    );
  }, []);

  const filtered = useMemo(() => {
    return locations.filter((l) => {
      if (start && l.start < start) return false;
      if (end && l.start > end) return false;
      if (title && !l.title.toLowerCase().includes(title.toLowerCase())) return false;
      return true;
    });
  }, [locations, start, end, title]);

  useEffect(() => {
    setCurrentIndex(0);
    setPlaying(false);
  }, [filtered.length]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setCurrentIndex((idx) => {
        if (idx >= filtered.length - 1) {
          clearInterval(id);
          setPlaying(false);
          return idx;
        }
        return idx + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, filtered.length]);

  const center = filtered[0]
    ? [filtered[0].latitude, filtered[0].longitude]
    : [0, 0];

  function CenterMap({ position }) {
    const map = useMap();
    useEffect(() => {
      if (position) map.setView(position);
    }, [map, position]);
    return null;
  }

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
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="range"
          min={0}
          max={Math.max(filtered.length - 1, 0)}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(Number(e.target.value))}
        />
        <button onClick={() => setPlaying((p) => !p)} style={{ marginLeft: '0.5rem' }}>
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>
      <MapContainer center={center} zoom={2} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {filtered[currentIndex] && (
          <CenterMap
            position={[filtered[currentIndex].latitude, filtered[currentIndex].longitude]}
          />
        )}
        {filtered.slice(0, currentIndex + 1).map((loc, idx) => (
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

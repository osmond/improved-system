import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  CircleMarker,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import 'leaflet.heat';
import locationsData from '@/data/kindle/locations.json';

export default function ReadingMap() {
  const [locations, setLocations] = useState([]);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [title, setTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [zoom, setZoom] = useState(5);
  const [mode, setMode] = useState('cluster');
  const [userToggled, setUserToggled] = useState(false);
  const [basemap, setBasemap] = useState(
    () => localStorage.getItem('basemap') || 'osm'
  );

  useEffect(() => {
    localStorage.setItem('basemap', basemap);
  }, [basemap]);

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

  function ZoomHandler() {
    useMapEvents({
      zoomend: (e) => setZoom(e.target.getZoom()),
    });
    return null;
  }

  function HeatmapLayer({ points }) {
    const map = useMap();
    useEffect(() => {
      if (!map) return;
      const heat = L.heatLayer(points, { radius: 25 }).addTo(map);
      return () => {
        map.removeLayer(heat);
      };
    }, [map, points]);
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
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="radio"
            name="mode"
            value="cluster"
            checked={mode === 'cluster'}
            onChange={(e) => {
              setMode(e.target.value);
              setUserToggled(true);
            }}
          />
          Cluster
        </label>
        <label style={{ marginLeft: '0.5rem' }}>
          <input
            type="radio"
            name="mode"
            value="heatmap"
            checked={mode === 'heatmap'}
            onChange={(e) => {
              setMode(e.target.value);
              setUserToggled(true);
            }}
          />
          Heatmap
        </label>
      </div>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: '400px', width: '100%' }}
      >
        <ZoomHandler />
        <LayersControl position="topright">
          <LayersControl.BaseLayer
            checked={basemap === 'osm'}
            name="OpenStreetMap"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              eventHandlers={{ add: () => setBasemap('osm') }}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            checked={basemap === 'stamen'}
            name="Stamen Terrain"
          >
            <TileLayer
              attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="https://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.stamen.com/terrain/{z}/{x}/{y}.jpg"
              eventHandlers={{ add: () => setBasemap('stamen') }}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            checked={basemap === 'carto'}
            name="Carto Dark"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              eventHandlers={{ add: () => setBasemap('carto') }}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer
            checked={basemap === 'esri'}
            name="ESRI Satellite"
          >
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              eventHandlers={{ add: () => setBasemap('esri') }}
            />
          </LayersControl.BaseLayer>
        </LayersControl>
        {filtered[currentIndex] && (
          <CenterMap
            position={[filtered[currentIndex].latitude, filtered[currentIndex].longitude]}
          />
        )}
        {(() => {
          const points = filtered
            .slice(0, currentIndex + 1)
            .map((loc) => [loc.latitude, loc.longitude]);
          const zoomThreshold = 8;
          const lowZoom = 4;
          let displayMode = 'cluster';
          if (zoom >= zoomThreshold) displayMode = 'markers';
          else if (zoom < lowZoom && !userToggled) displayMode = 'heatmap';
          else displayMode = mode;
          if (displayMode === 'markers') {
            return filtered.slice(0, currentIndex + 1).map((loc, idx) => (
              <CircleMarker
                key={idx}
                center={[loc.latitude, loc.longitude]}
                radius={5}
                pathOptions={{ color: 'red' }}
              />
            ));
          }
          if (displayMode === 'heatmap') {
            return <HeatmapLayer points={points} />;
          }
          return (
            <MarkerClusterGroup>
              {filtered.slice(0, currentIndex + 1).map((loc, idx) => (
                <CircleMarker
                  key={idx}
                  center={[loc.latitude, loc.longitude]}
                  radius={5}
                  pathOptions={{ color: 'red' }}
                />
              ))}
            </MarkerClusterGroup>
          );
        })()}
      </MapContainer>
    </div>
  );
}

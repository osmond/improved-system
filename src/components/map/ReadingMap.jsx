import React, { useEffect, useMemo, useState } from 'react';
import {
  MapContainer,
  TileLayer,
  LayersControl,
  CircleMarker,
  GeoJSON,
  useMap,
  Tooltip,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import HeatmapLayer from './HeatmapLayer';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';
import { scaleSequential } from 'd3-scale';
import { interpolateHsl } from 'd3-interpolate';
import { fetchSessionLocations, getSessionLocations } from '@/services/locationData';
import statesTopo from '@/lib/us-states.json';
import worldTopo from '@/lib/world-countries.json';
import { Skeleton } from '@/ui/skeleton';

export default function ReadingMap() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [title, setTitle] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [basemap, setBasemap] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('basemap') || 'osm';
    }
    return 'osm';
  });
  const [zoom, setZoom] = useState(5);
  const [mode, setMode] = useState('auto');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('basemap', basemap);
    }
  }, [basemap]);

  useEffect(() => {
    fetchSessionLocations()
      .then((data) => {
        const sorted = [...data].sort(
          (a, b) => new Date(a.start) - new Date(b.start)
        );
        setLocations(sorted);
        if (!data.length) setError('No location data available');
      })
      .catch(() => {
        const local = getSessionLocations();
        const sorted = [...local].sort(
          (a, b) => new Date(a.start) - new Date(b.start)
        );
        setLocations(sorted);
        if (local.length) {
          setMessage('Showing local location data');
        } else {
          setError('Failed to load location data');
        }
      })
      .finally(() => setLoading(false));
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

  function ZoomHandler({ onZoom }) {
    const map = useMap();
    useEffect(() => {
      const update = () => onZoom(map.getZoom());
      map.on('zoomend', update);
      update();
      return () => {
        map.off('zoomend', update);
      };
    }, [map, onZoom]);
    return null;
  }

  function Legend({ colorScale, maxCount }) {
    const map = useMap();
    useEffect(() => {
      const legend = L.control({ position: 'bottomright' });
      legend.onAdd = () => {
        const div = L.DomUtil.create('div', 'legend');
        div.style.background = 'white';
        div.style.padding = '6px 8px';
        div.style.font = '12px/14px Arial, Helvetica, sans-serif';
        div.style.boxShadow = '0 0 15px rgba(0,0,0,0.2)';
        div.style.borderRadius = '5px';
        const grades = maxCount
          ? Array.from({ length: 5 }, (_, i) =>
              Math.round((i * maxCount) / 5)
            )
          : [0];
        grades.push(maxCount);
        const labels = [];
        for (let i = 0; i < grades.length - 1; i++) {
          const from = grades[i];
          const to = grades[i + 1];
          const color = colorScale((from + to) / 2);
          labels.push(
            `<i style="background:${color}; width: 18px; height: 18px; float: left; margin-right: 8px; opacity: 0.7"></i> ${from}${
              to ? `&ndash;${to}` : ''
            }`
          );
        }
        div.innerHTML = labels.join('<br>');
        return div;
      };
      legend.addTo(map);
      return () => {
        legend.remove();
      };
    }, [map, colorScale, maxCount]);
    return null;
  }

  // Aggregate locations by region (US states or world countries)
  const { data: choropleth, counts } = useMemo(() => {
    const states = feature(statesTopo, statesTopo.objects.states);
    const countries = feature(worldTopo, worldTopo.objects.countries);
    const features = [
      ...countries.features.filter((f) => f.id !== '840'),
      ...states.features,
    ];
    const titleSets = {};
    filtered.forEach((loc) => {
      const point = [loc.longitude, loc.latitude];
      let region = states.features.find((s) => geoContains(s, point));
      if (!region) {
        region = countries.features.find((c) => geoContains(c, point));
      }
      if (region) {
        const name = region.properties.name;
        if (!titleSets[name]) titleSets[name] = new Set();
        titleSets[name].add(loc.title);
      }
    });
    const counts = {};
    Object.entries(titleSets).forEach(([name, set]) => {
      counts[name] = set.size;
    });
    return {
      data: {
        type: 'FeatureCollection',
        features: features.map((f) => ({
          ...f,
          properties: {
            ...f.properties,
            count: counts[f.properties.name] || 0,
          },
        })),
      },
      counts,
    };
  }, [filtered]);

  const maxCount = useMemo(
    () => Math.max(...Object.values(counts), 0),
    [counts]
  );

  const colorScale = useMemo(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
      const interpolator = interpolateHsl('hsl(0, 0%, 0%)', 'hsl(0, 0%, 100%)');
      return scaleSequential(interpolator).domain([0, maxCount || 1]);
    }
    const style = getComputedStyle(document.documentElement);
    const start = `hsl(${style
      .getPropertyValue('--chart-1')
      .trim()
      .replace(/\s+/g, ',')})`;
    const end = `hsl(${style
      .getPropertyValue('--chart-10')
      .trim()
      .replace(/\s+/g, ',')})`;
    const interpolator = interpolateHsl(start, end);
    return scaleSequential(interpolator).domain([0, maxCount || 1]);
  }, [maxCount]);

  const points = useMemo(() => {
    return [...filtered]
      .sort((a, b) => new Date(a.start) - new Date(b.start))
      .slice(0, currentIndex + 1)
      .map((loc) => [loc.latitude, loc.longitude]);
  }, [filtered, currentIndex]);

  const computedMode = useMemo(() => {
    if (mode !== 'auto') return mode;
    if (zoom < 4) return 'heatmap';
    if (zoom < 8) return 'cluster';
    return 'markers';
  }, [mode, zoom]);

  if (loading)
    return <Skeleton className="h-[480px] w-full" data-testid="loading" />;

  if (error)
    return (
      <div data-testid="error" role="alert">
        {error}
      </div>
    );

  return (
    <div>
      {message && (
        <div data-testid="message" role="status">
          {message}
        </div>
      )}
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
          Mode:
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ marginLeft: '0.5rem' }}
          >
            <option value="auto">Auto ({computedMode})</option>
            <option value="markers">Markers</option>
            <option value="cluster">Cluster</option>
            <option value="heatmap">Heatmap</option>
          </select>
        </label>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '400px', width: '100%' }}
      >
        <ZoomHandler onZoom={setZoom} />
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
        <GeoJSON
          data={choropleth}
          style={(f) => ({
            fillColor: colorScale(f.properties.count || 0),
            weight: 1,
            color: 'hsl(var(--background))',
            fillOpacity: 0.7,
          })}
        />
        <Legend colorScale={colorScale} maxCount={maxCount} />
        {computedMode === 'heatmap' && <HeatmapLayer points={points} />}
        <Polyline
          positions={points}
          pathOptions={{ color: 'hsl(var(--chart-2))', weight: 4 }}
        />
        {computedMode === 'cluster' && (
          <MarkerClusterGroup>
            {filtered.slice(0, currentIndex + 1).map((loc, idx) => (
              <CircleMarker
                key={idx}
                center={[loc.latitude, loc.longitude]}
                radius={5}
                pathOptions={{ color: 'hsl(var(--chart-1))' }}
              >
                <Tooltip>
                  {loc.title}
                  <br />
                  {new Date(loc.start).toLocaleDateString()}
                </Tooltip>
              </CircleMarker>
            ))}
          </MarkerClusterGroup>
        )}
        {computedMode === 'markers' &&
          filtered.slice(0, currentIndex + 1).map((loc, idx) => (
            <CircleMarker
              key={idx}
              center={[loc.latitude, loc.longitude]}
              radius={5}
              pathOptions={{ color: 'hsl(var(--chart-1))' }}
            >
              <Tooltip>
                {loc.title}
                <br />
                {new Date(loc.start).toLocaleDateString()}
              </Tooltip>
            </CircleMarker>
          ))}
      </MapContainer>
    </div>
  );
}

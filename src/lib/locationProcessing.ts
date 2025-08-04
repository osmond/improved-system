export interface LocationPoint {
  latitude: number;
  longitude: number;
  /** ISO timestamp */
  timestamp: string;
}

export interface VisitGroup {
  start: string;
  end: string;
  latitude: number;
  longitude: number;
  placeId: string;
}

interface CurrentVisit extends VisitGroup {
  count: number;
}

const EARTH_RADIUS = 6371000; // meters

export function haversineDistance(a: LocationPoint, b: LocationPoint): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);
  const h =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h));
}

export function placeIdFor(lat: number, lon: number): string {
  return `${lat.toFixed(3)},${lon.toFixed(3)}`;
}

export function groupConsecutivePoints(
  points: LocationPoint[],
  threshold = 100,
): VisitGroup[] {
  if (!points.length) return [];
  const sorted = [...points].sort((a, b) =>
    a.timestamp.localeCompare(b.timestamp),
  );
  const visits: VisitGroup[] = [];
  let current: CurrentVisit = {
    start: sorted[0].timestamp,
    end: sorted[0].timestamp,
    latitude: sorted[0].latitude,
    longitude: sorted[0].longitude,
    count: 1,
  };
  let prev = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const p = sorted[i];
    const dist = haversineDistance(prev, p);
    if (dist > threshold) {
      const lat = current.latitude / current.count;
      const lon = current.longitude / current.count;
      visits.push({
        start: current.start,
        end: current.end,
        latitude: lat,
        longitude: lon,
        placeId: placeIdFor(lat, lon),
      });
      current = {
        start: p.timestamp,
        end: p.timestamp,
        latitude: p.latitude,
        longitude: p.longitude,
        count: 1,
      };
    } else {
      current.end = p.timestamp;
      current.latitude += p.latitude;
      current.longitude += p.longitude;
      current.count++;
    }
    prev = p;
  }
  const lat = current.latitude / current.count;
  const lon = current.longitude / current.count;
  visits.push({
    start: current.start,
    end: current.end,
    latitude: lat,
    longitude: lon,
    placeId: placeIdFor(lat, lon),
  });
  return visits;
}

export default groupConsecutivePoints;

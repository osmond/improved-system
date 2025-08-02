
export interface LocationFix {
  timestamp: number;
  lat: number;
  lng: number;
}

const DB_NAME = 'location-db';
const STORE_NAME = 'fixes';
let dbPromise: Promise<IDBDatabase> | null = null;

function getDB(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open(DB_NAME, 1);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(STORE_NAME, { keyPath: 'timestamp' });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  return dbPromise;
}

export async function storeFix(fix: LocationFix): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(fix);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getFixes(): Promise<LocationFix[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as LocationFix[]);
    req.onerror = () => reject(req.error);
  });
=======
import { groupConsecutivePoints, placeIdFor, type LocationPoint } from './locationProcessing';

export type LocationCategory = 'home' | 'work' | 'other';

export interface LocationCluster {
  id: string;
  latitude: number;
  longitude: number;
  category: LocationCategory;
}

export interface LocationVisit {
  /** ISO date of the visit */
  date: string;
  /** Identifier for the place or cluster */
  placeId: string;
  /** Basic category to distinguish home/work/other */
  category: LocationCategory;
}

const POINTS_KEY = 'loc:points';
const CLUSTERS_KEY = 'loc:clusters';

function daysAgo(day: number, hour = 8): string {
  const d = new Date();
  d.setDate(d.getDate() - day);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
}

const home = { latitude: 44.0, longitude: -93.0 };
const office = { latitude: 44.002, longitude: -93.002 };
const cafe = { latitude: 44.003, longitude: -93.003 };

const mockPoints: LocationPoint[] = [
  { ...home, timestamp: daysAgo(0, 8) },
  { ...home, timestamp: daysAgo(0, 9) },
  { ...home, timestamp: daysAgo(1, 8) },
  { ...home, timestamp: daysAgo(2, 8) },
  { ...home, timestamp: daysAgo(3, 8) },
  { ...cafe, timestamp: daysAgo(4, 10) },
  { ...home, timestamp: daysAgo(5, 8) },
  { ...office, timestamp: daysAgo(5, 14) },
];

const mockClusters: Record<string, LocationCluster> = {
  [placeIdFor(home.latitude, home.longitude)]: {
    id: placeIdFor(home.latitude, home.longitude),
    ...home,
    category: 'home',
  },
  [placeIdFor(office.latitude, office.longitude)]: {
    id: placeIdFor(office.latitude, office.longitude),
    ...office,
    category: 'work',
  },
  [placeIdFor(cafe.latitude, cafe.longitude)]: {
    id: placeIdFor(cafe.latitude, cafe.longitude),
    ...cafe,
    category: 'other',
  },
};

function readPoints(): LocationPoint[] {
  if (typeof localStorage === 'undefined') return [...mockPoints];
  try {
    const raw = localStorage.getItem(POINTS_KEY);
    if (!raw) return [...mockPoints];
    return JSON.parse(raw) as LocationPoint[];
  } catch {
    return [...mockPoints];
  }
}

function writePoints(points: LocationPoint[]): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(POINTS_KEY, JSON.stringify(points));
}

export function logLocationPoint(point: LocationPoint): void {
  const points = readPoints();
  points.push(point);
  writePoints(points);
}

function readClusters(): Record<string, LocationCluster> {
  if (typeof localStorage === 'undefined') return { ...mockClusters };
  try {
    const raw = localStorage.getItem(CLUSTERS_KEY);
    if (!raw) return { ...mockClusters };
    return JSON.parse(raw) as Record<string, LocationCluster>;
  } catch {
    return { ...mockClusters };
  }
}

function writeClusters(clusters: Record<string, LocationCluster>): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(CLUSTERS_KEY, JSON.stringify(clusters));
}

export function tagCluster(id: string, category: LocationCategory): void {
  const clusters = readClusters();
  const existing = clusters[id];
  if (existing) {
    existing.category = category;
  } else {
    const [lat, lon] = id.split(',').map(Number);
    clusters[id] = { id, latitude: lat, longitude: lon, category };
  }
  writeClusters(clusters);
}

async function reverseGeocodeCategory(
  lat: number,
  lon: number,
): Promise<LocationCategory> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
    );
    const data = await res.json();
    const addr = data.address || {};
    if (addr.residential || addr.house_number) return 'home';
    if (addr.office || addr.commercial || addr.industrial) return 'work';
    return 'other';
  } catch {
    return 'other';
  }
}

export async function ensureCluster(
  id: string,
  lat: number,
  lon: number,
): Promise<LocationCategory> {
  const clusters = readClusters();
  const existing = clusters[id];
  if (existing) return existing.category;
  const category = await reverseGeocodeCategory(lat, lon);
  clusters[id] = { id, latitude: lat, longitude: lon, category };
  writeClusters(clusters);
  return category;
}

export function getLocationVisits(): LocationVisit[] {
  const points = readPoints();
  const visits = groupConsecutivePoints(points);
  const clusters = readClusters();
  return visits.map((v) => ({
    date: v.start.slice(0, 10),
    placeId: v.placeId,
    category: clusters[v.placeId]?.category ?? 'other',
  }));

}

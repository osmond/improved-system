
import { groupConsecutivePoints, placeIdFor, type LocationPoint } from './locationProcessing';

export interface LocationFix {
  timestamp: number;
  lat: number;
  lng: number;
}

const DB_NAME = 'location-db';
const STORE_NAME = 'fixes';
let dbPromise: Promise<IDBDatabase> | null = null;

const RETENTION_KEY = 'loc:retentionDays';
const DEFAULT_RETENTION_DAYS = 30;

export function getRetentionDays(): number {
  if (typeof localStorage === 'undefined') return DEFAULT_RETENTION_DAYS;
  const raw = localStorage.getItem(RETENTION_KEY);
  const parsed = raw ? parseInt(raw, 10) : NaN;
  return Number.isFinite(parsed) ? parsed : DEFAULT_RETENTION_DAYS;
}

export function setRetentionDays(days: number): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(RETENTION_KEY, String(days));
}

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

async function purgeOldFixes(days: number): Promise<void> {
  const db = await getDB();
  const cutoff = Date.now() - days * 86400000;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.openCursor();
    req.onsuccess = () => {
      const cursor = req.result;
      if (cursor) {
        if ((cursor.key as number) < cutoff) cursor.delete();
        cursor.continue();
      }
    };
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function storeFix(fix: LocationFix): Promise<void> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).put(fix);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  }).then(() => purgeOldFixes(getRetentionDays()));
}

export async function getFixes(): Promise<LocationFix[]> {
  const db = await getDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result as LocationFix[]);
    req.onerror = () => reject(req.error);
  });
}
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
const BASELINE_KEY = 'loc:baseline';

export interface SocialBaseline {
  locationEntropy: number;
  outOfHomeFrequency: number;
}

function readBaseline(): SocialBaseline | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(BASELINE_KEY);
    return raw ? (JSON.parse(raw) as SocialBaseline) : null;
  } catch {
    return null;
  }
}

function writeBaseline(baseline: SocialBaseline): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(BASELINE_KEY, JSON.stringify(baseline));
}

export function getSocialBaseline(): SocialBaseline | null {
  return readBaseline();
}

export function setSocialBaseline(baseline: SocialBaseline): void {
  writeBaseline(baseline);
}

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
    const all = raw ? (JSON.parse(raw) as LocationPoint[]) : [...mockPoints];
    const cutoff = Date.now() - getRetentionDays() * 86400000;
    return all.filter((p) => new Date(p.timestamp).getTime() >= cutoff);
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
  const cutoff = Date.now() - getRetentionDays() * 86400000;
  const filtered = points.filter(
    (p) => new Date(p.timestamp).getTime() >= cutoff,
  );
  writePoints(filtered);
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

export async function exportLocationData() {
  const [fixes, points] = await Promise.all([getFixes(), readPoints()]);
  const clusters = readClusters();
  const baseline = readBaseline();
  return { fixes, points, clusters, baseline };
}

export async function clearLocationData(): Promise<void> {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(POINTS_KEY);
    localStorage.removeItem(CLUSTERS_KEY);
  }
  const db = await getDB();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function purgeOldLocationData(
  days = getRetentionDays(),
): Promise<void> {
  const points = readPoints().filter(
    (p) => new Date(p.timestamp).getTime() >= Date.now() - days * 86400000,
  );
  writePoints(points);
  await purgeOldFixes(days);
}

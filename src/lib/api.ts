import type { DailyWeather } from "./weatherApi";
import { getWeatherForRuns } from "./weatherApi";
import { Geolocation } from "@capacitor/geolocation";
import {
  getLocationVisits as deriveLocationVisits,
  type LocationVisit,
} from "./locationStore";
import { trackRouteRun, fetchRouteRunHistory, resetRouteRuns } from "./telemetry";
import { computeRouteMetrics } from "./routeMetrics";
import { getAllSessionMeta } from "./sessionStore";
export { calculateRouteSimilarity } from "./routeMetrics";
export type { LocationVisit } from "./locationStore";
import dailyReadingData from "@/data/kindle/daily-stats.json";
import sessionData from "../data/kindle/sessions.json";
import asinTitleMap from "../data/kindle/asin-title-map.json";
import readingSpeedData from "../data/kindle/reading-speed.json";
import locationData from "../data/kindle/locations.json";

export type Activity = {
  id: number;
  type: string;
  distance: number;
  duration: number;
  date: string;
};

export type GarminData = {
  steps: number;
  sleep: number;
  heartRate: number;
  calories: number;
  activities: Activity[];
  /** ISO timestamp of the last sync with Garmin */
  lastSync: string;
};

export type GarminDay = {
  date: string;
  steps: number;
};

export type MetricDay = {
  date: string;
  value: number;
};

export interface SeasonalBaseline {
  /** Month number 1-12 */
  month: number;
  /** Expected minimum value for the month */
  min: number;
  /** Expected maximum value for the month */
  max: number;
}

export const mockSeasonalBaselines: SeasonalBaseline[] = [
  { month: 1, min: 6000, max: 10000 },
  { month: 2, min: 6500, max: 10500 },
  { month: 3, min: 7000, max: 11000 },
  { month: 4, min: 7500, max: 11500 },
  { month: 5, min: 8000, max: 12000 },
  { month: 6, min: 8500, max: 12500 },
  { month: 7, min: 8500, max: 12500 },
  { month: 8, min: 8000, max: 12000 },
  { month: 9, min: 7500, max: 11500 },
  { month: 10, min: 7000, max: 11000 },
  { month: 11, min: 6500, max: 10500 },
  { month: 12, min: 6000, max: 10000 },
];

export async function getSeasonalBaselines(): Promise<SeasonalBaseline[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSeasonalBaselines), 200);
  });
}

export const mockDailySteps: GarminDay[] = [
  { date: "2025-07-24", steps: 7500 },
  { date: "2025-07-25", steps: 8200 },
  { date: "2025-07-26", steps: 6100 },
  { date: "2025-07-27", steps: 9450 },
  { date: "2025-07-28", steps: 10020 },
  { date: "2025-07-29", steps: 8456 },
  { date: "2025-07-30", steps: 10342 },
];

function generateMockMetricDays(base: number, variance = 0.1): MetricDay[] {
  return Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    const factor = 1 + (Math.random() - 0.5) * variance;
    return {
      date: d.toISOString().slice(0, 10),
      value: +(base * factor).toFixed(2),
    };
  });
}

export const mockDailySleep: MetricDay[] = generateMockMetricDays(7.5, 0.2);
export const mockDailyHeartRate: MetricDay[] = generateMockMetricDays(65, 0.15);
export const mockDailyCalories: MetricDay[] = generateMockMetricDays(
  2200,
  0.25,
);

export const mockGarminData: GarminData = {
  steps: 10342,
  sleep: 7.4,
  heartRate: 62,
  calories: 2200,
  activities: [
    { id: 1, type: "Run", distance: 5.2, duration: 42, date: "2025-07-30" },
    { id: 2, type: "Walk", distance: 2.1, duration: 25, date: "2025-07-29" },
  ],
  lastSync: new Date().toISOString(),
};

export async function getGarminData(): Promise<GarminData> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...mockGarminData, lastSync: new Date().toISOString() });
    }, 500);
  });
}

// ----- Activity minutes for radial chart -----
export interface ActivityMinutes {
  activity: string;
  minutes: number;
  /** CSS color variable string */
  fill: string;
}

export const mockActivityMinutes: ActivityMinutes[] = [
  { activity: "Run", minutes: 520, fill: "var(--color-run)" },
  { activity: "Bike", minutes: 340, fill: "var(--color-bike)" },
  { activity: "Walk", minutes: 120, fill: "var(--color-walk)" },
  { activity: "Strength", minutes: 220, fill: "var(--color-strength)" },
  { activity: "Other", minutes: 90, fill: "var(--color-other)" },
];

export async function getActivityMinutes(): Promise<ActivityMinutes[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockActivityMinutes), 200);
  });
}
export async function getDailySteps(): Promise<GarminDay[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDailySteps), 300);
  });
}

export async function getDailySleep(): Promise<MetricDay[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDailySleep), 300);
  });
}

export async function getDailyHeartRate(): Promise<MetricDay[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDailyHeartRate), 300);
  });
}

export async function getDailyCalories(): Promise<MetricDay[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDailyCalories), 300);
  });
}

// ----- Hourly step data -----

export interface HourlySteps {
  /** ISO timestamp for the start of the hour */
  timestamp: string;
  /** Step count recorded during that hour */
  steps: number;
}

export function generateMockHourlySteps(days = 30): HourlySteps[] {
  const data: HourlySteps[] = [];
  for (let i = 0; i < days; i++) {
    const base = new Date();
    base.setDate(base.getDate() - i);
    for (let h = 0; h < 24; h++) {
      const d = new Date(base);
      d.setHours(h, 0, 0, 0);
      data.push({
        timestamp: d.toISOString(),
        steps: Math.floor(100 + Math.random() * 400),
      });
    }
  }
  return data;
}

export async function getHourlySteps(): Promise<HourlySteps[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockHourlySteps()), 200);
  });
}

// ----- Activity snapshots -----

export interface ActivitySnapshot {
  /** ISO timestamp for the start of the hour */
  timestamp: string;
  /** Average heart rate during that hour */
  heartRate: number;
  /** Step count recorded during that hour */
  steps: number;
  /** Number of foreground app changes during the hour */
  appChanges: number;
  /** Combined keyboard and mouse events during the hour */
  inputCadence: number;
  /** Identifier for Wi-Fi network or location cluster */
  location: string;
  /** Network SSID or identifier */
  network: string;
}

export async function getActivitySnapshots(
  days = 30,
): Promise<ActivitySnapshot[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const speedMap = new Map<number, number>();
  try {
    const res = await fetch('/api/kindle/reading-speed');
    if (!res.ok) throw new Error('fail');
    const speeds: { start: string; wpm: number }[] = await res.json();
    speeds.forEach((r) => {
      speedMap.set(new Date(r.start).getTime(), r.wpm);
    });
  } catch {
    (readingSpeedData as { start: string; wpm: number }[]).forEach((r) => {
      speedMap.set(new Date(r.start).getTime(), r.wpm);
    });
  }

  const locationMap = new Map<number, string>();
  try {
    const res = await fetch('/api/kindle/locations');
    if (!res.ok) throw new Error('fail');
    const locs: { start: string; latitude: number; longitude: number }[] =
      await res.json();
    locs.forEach((l) => {
      locationMap.set(
        new Date(l.start).getTime(),
        `${l.latitude.toFixed(3)},${l.longitude.toFixed(3)}`,
      );
    });
  } catch {
    (
      locationData as { start: string; latitude: number; longitude: number }[]
    ).forEach((l) => {
      locationMap.set(
        new Date(l.start).getTime(),
        `${l.latitude.toFixed(3)},${l.longitude.toFixed(3)}`,
      );
    });
  }

  const sessions = await getKindleSessions();

  return sessions
    .filter((s) => new Date(s.start) >= cutoff)
    .map((s) => {
      const start = new Date(s.start);
      const hourStart = new Date(start);
      hourStart.setMinutes(0, 0, 0);
      const key = start.getTime();
      const wpm = speedMap.get(key) ?? 0;
      const loc = locationMap.get(key) ?? "unknown";
      return {
        timestamp: hourStart.toISOString(),
        heartRate: wpm,
        steps: s.duration,
        appChanges: s.highlights,
        inputCadence: wpm,
        location: loc,
        network: s.asin,
      } as ActivitySnapshot;
    });
}

// ----- State visit data -----
import type { StateVisit } from "./types";

export const mockStateVisits: StateVisit[] = [
  {
    stateCode: "CA",
    visited: true,
    totalDays: 10,
    totalMiles: 1200,
    cities: [
      { name: "Los Angeles", days: 4, miles: 300 },
      { name: "San Francisco", days: 3, miles: 400 },
      { name: "San Diego", days: 3, miles: 500 },
    ],
    log: [
      { date: new Date().toISOString().slice(0, 10), type: "run", miles: 5 },
      { date: new Date().toISOString().slice(0, 10), type: "bike", miles: 10 },
      {
        date: new Date(Date.now() - 28 * 86400000).toISOString().slice(0, 10),
        type: "run",
        miles: 8,
      },
      {
        date: new Date(Date.now() - 60 * 86400000).toISOString().slice(0, 10),
        type: "bike",
        miles: 15,
      },
    ],
  },
  {
    stateCode: "TX",
    visited: true,
    totalDays: 5,
    totalMiles: 600,
    cities: [
      { name: "Austin", days: 2, miles: 200 },
      { name: "Houston", days: 3, miles: 400 },
    ],
    log: [
      { date: new Date().toISOString().slice(0, 10), type: "run", miles: 3 },
      {
        date: new Date(Date.now() - 10 * 86400000).toISOString().slice(0, 10),
        type: "bike",
        miles: 12,
      },
      {
        date: new Date(Date.now() - 40 * 86400000).toISOString().slice(0, 10),
        type: "run",
        miles: 6,
      },
    ],
  },
  {
    stateCode: "FL",
    visited: true,
    totalDays: 7,
    totalMiles: 900,
    cities: [
      { name: "Miami", days: 3, miles: 300 },
      { name: "Orlando", days: 2, miles: 200 },
      { name: "Tampa", days: 2, miles: 400 },
    ],
    log: [
      { date: new Date().toISOString().slice(0, 10), type: "run", miles: 7 },
      {
        date: new Date(Date.now() - 14 * 86400000).toISOString().slice(0, 10),
        type: "bike",
        miles: 20,
      },
    ],
  },
  {
    stateCode: "CO",
    visited: true,
    totalDays: 8,
    totalMiles: 1100,
    cities: [
      { name: "Denver", days: 4, miles: 500 },
      { name: "Boulder", days: 2, miles: 300 },
      { name: "Colorado Springs", days: 2, miles: 300 },
    ],
    log: [
      { date: new Date().toISOString().slice(0, 10), type: "bike", miles: 10 },
      {
        date: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10),
        type: "run",
        miles: 6,
      },
      {
        date: new Date(Date.now() - 35 * 86400000).toISOString().slice(0, 10),
        type: "run",
        miles: 9,
      },
    ],
  },
  {
    stateCode: "WA",
    visited: true,
    totalDays: 6,
    totalMiles: 800,
    cities: [
      { name: "Seattle", days: 3, miles: 400 },
      { name: "Spokane", days: 2, miles: 250 },
      { name: "Tacoma", days: 1, miles: 150 },
    ],
    log: [
      { date: new Date().toISOString().slice(0, 10), type: "run", miles: 5 },
      {
        date: new Date(Date.now() - 21 * 86400000).toISOString().slice(0, 10),
        type: "bike",
        miles: 15,
      },
    ],
  },
  {
    stateCode: "IL",
    visited: true,
    totalDays: 4,
    totalMiles: 500,
    cities: [{ name: "Chicago", days: 4, miles: 500 }],
    log: [
      { date: new Date().toISOString().slice(0, 10), type: "run", miles: 4 },
      {
        date: new Date(Date.now() - 20 * 86400000).toISOString().slice(0, 10),
        type: "bike",
        miles: 12,
      },
    ],
  },
  {
    stateCode: "NY",
    visited: false,
    totalDays: 0,
    totalMiles: 0,
    cities: [],
    log: [],
  },
];

export async function getStateVisits(): Promise<StateVisit[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStateVisits), 300);
  });
}

// ----- Location visits -----

export async function getLocationVisits(): Promise<LocationVisit[]> {
  return deriveLocationVisits();
}

// ----- Device location -----

export interface CurrentLocation {
  latitude: number;
  longitude: number;
}

export async function getCurrentLocation(): Promise<CurrentLocation | null> {
  try {
    await Geolocation.requestPermissions();
    const { coords } = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
    });
    return { latitude: coords.latitude, longitude: coords.longitude };
  } catch {
    return null;
  }
}

// ----- Running stats -----

export interface PaceDistributionBin {
  bin: string;
  upper: number;
  lower: number;
}

export interface HeartRateZoneData {
  zone: string;
  count: number;
}

export interface PaceHeartPoint {
  pace: number;
  heartRate: number;
}

export interface TempBucket {
  label: string;
  count: number;
}

export interface WeatherCondition {
  label: string;
  count: number;
}

export interface AnnualMileage {
  year: number;
  totalMiles: number;
}

export interface HourActivity {
  hour: number;
  pct: number;
}

export interface WeekdayMileage {
  day: string;
  pct: number;
}

export interface DistanceBucket {
  label: string;
  count: number;
}

export interface RunEnvironmentPoint {
  pace: number;
  temperature: number;
  humidity: number;
  wind: number;
  elevation: number;
}

export interface TreadmillOutdoor {
  outdoor: number;
  treadmill: number;
}

export interface RunningStats {
  paceDistribution: PaceDistributionBin[];
  heartRateZones: HeartRateZoneData[];
  paceVsHeart: PaceHeartPoint[];
  temperature: TempBucket[];
  weatherConditions: WeatherCondition[];
  annualMileage: AnnualMileage[];
  byHour: HourActivity[];
  byWeekday: WeekdayMileage[];
  distanceBuckets: DistanceBucket[];
  treadmillOutdoor: TreadmillOutdoor;
  paceEnvironment: RunEnvironmentPoint[];
  dailyWeather: DailyWeather[];
}

export function generateMockRunningStats(): RunningStats {
  const paceDistribution: PaceDistributionBin[] = [];
  for (let i = 0; i < 10; i++) {
    const minutes = 5 + i * 0.5;
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);
    const bin = `${m}:${s.toString().padStart(2, "0")}`;
    const value = Math.round(Math.random() * 8 + 2);
    paceDistribution.push({ bin, upper: value, lower: -value });
  }

  const heartRateZones: HeartRateZoneData[] = [
    { zone: "Z1", count: 20 },
    { zone: "Z2", count: 40 },
    { zone: "Z3", count: 30 },
    { zone: "Z4", count: 15 },
    { zone: "Z5", count: 5 },
  ];

  const paceVsHeart: PaceHeartPoint[] = Array.from({ length: 30 }, () => {
    const pace = +(5 + Math.random() * 4).toFixed(2);
    const heartRate = Math.round(130 + (10 - pace) * 10 + Math.random() * 5);
    return { pace, heartRate };
  });

  const temperature: TempBucket[] = [
    { label: "40-50", count: 3 },
    { label: "50-60", count: 8 },
    { label: "60-70", count: 12 },
    { label: "70-80", count: 6 },
    { label: "80-90", count: 2 },
  ];

  const weatherConditions: WeatherCondition[] = [
    { label: "Sunny", count: 15 },
    { label: "Cloudy", count: 8 },
    { label: "Rain", count: 4 },
    { label: "Snow", count: 1 },
  ];

  const currentYear = new Date().getFullYear();
  const annualMileage: AnnualMileage[] = [];
  for (let year = currentYear - 5; year <= currentYear; year++) {
    annualMileage.push({
      year,
      totalMiles: 800 + Math.round(Math.random() * 700),
    });
  }

  const byHour: HourActivity[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    pct: Math.round(Math.random() * 10),
  }));

  const byWeekday: WeekdayMileage[] = [
    "Mon",
    "Tue",
    "Wed",
    "Thu",
    "Fri",
    "Sat",
    "Sun",
  ].map((day) => ({ day, pct: Math.round(Math.random() * 20) }));

  const distanceBuckets: DistanceBucket[] = [
    { label: "0-3", count: 4 },
    { label: "3-6", count: 10 },
    { label: "6-9", count: 8 },
    { label: "9-12", count: 5 },
    { label: "12+", count: 2 },
  ];

  const treadmillOutdoor: TreadmillOutdoor = { outdoor: 80, treadmill: 20 };

  const paceEnvironment: RunEnvironmentPoint[] = Array.from(
    { length: 50 },
    () => {
      const pace = +(6 + Math.random() * 2).toFixed(2);
      return {
        pace,
        temperature: Math.round(40 + pace * 5 + Math.random() * 10),
        humidity: Math.round(40 + Math.random() * 50),
        wind: +(Math.random() * 20).toFixed(1),
        elevation: Math.round(Math.random() * 300),
      };
    },
  );

  const today = new Date();
  const dailyWeather: DailyWeather[] = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    return {
      date: d.toISOString().slice(0, 10),
      temperature: Math.round(40 + Math.random() * 50),
      condition: ["Sunny", "Cloudy", "Rain", "Snow"][
        Math.floor(Math.random() * 4)
      ],
      humidity: Math.round(30 + Math.random() * 70),
      wind: +(Math.random() * 20).toFixed(1),
    };
  });

  return {
    paceDistribution,
    heartRateZones,
    paceVsHeart,
    temperature,
    weatherConditions,
    annualMileage,
    byHour,
    byWeekday,
    distanceBuckets,
    treadmillOutdoor,
    paceEnvironment,
    dailyWeather,
  };
}

export const mockRunningStats: RunningStats = generateMockRunningStats();

export async function getRunningStats(_range?: {
  start?: string | null;
  end?: string | null;
}): Promise<RunningStats> {
  const base = generateMockRunningStats();
  const sessions = await getRunningSessions();

  const dailyWeather: DailyWeather[] = sessions.map((s) => ({
    date: s.date,
    temperature: s.weather.temperature,
    condition: s.weather.condition,
    humidity: s.weather.humidity,
    wind: s.weather.wind,
  }));

  const conditionCounts: Record<string, number> = {};
  dailyWeather.forEach((w) => {
    conditionCounts[w.condition] = (conditionCounts[w.condition] || 0) + 1;
  });
  const weatherConditions = Object.entries(conditionCounts).map(([label, count]) => ({
    label,
    count,
  }));

  const bucketDefs = [
    { label: "40-50", min: 40, max: 50 },
    { label: "50-60", min: 50, max: 60 },
    { label: "60-70", min: 60, max: 70 },
    { label: "70-80", min: 70, max: 80 },
    { label: "80-90", min: 80, max: 90 },
  ];
  const temperatureBuckets = bucketDefs.map((b) => ({ label: b.label, count: 0 }));
  dailyWeather.forEach((w) => {
    for (let i = 0; i < bucketDefs.length; i++) {
      const b = bucketDefs[i];
      if (w.temperature >= b.min && w.temperature < b.max) {
        temperatureBuckets[i].count++;
        break;
      }
    }
  });

  const paceEnvironment: RunEnvironmentPoint[] = sessions.map((s) => ({
    pace: s.pace,
    temperature: s.weather.temperature,
    humidity: s.weather.humidity,
    wind: s.weather.wind,
    elevation: 0,
  }));

  base.paceEnvironment = paceEnvironment;
  base.dailyWeather = dailyWeather;
  base.weatherConditions = weatherConditions;
  base.temperature = temperatureBuckets;

  return base;
}

export interface WeeklyVolumePoint {
  week: string;
  miles: number;
}

export interface WeeklyMetricPoint {
  date: string;
  value: number;
}

export function generateMockWeeklyVolume(): WeeklyVolumePoint[] {
  const weeks: WeeklyVolumePoint[] = [];
  for (let i = 0; i < 26; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (25 - i) * 7);
    const week = date.toISOString().slice(0, 10);
    weeks.push({ week, miles: Math.round(20 + Math.random() * 30) });
  }
  return weeks;
}

export async function getWeeklyVolume(): Promise<WeeklyVolumePoint[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockWeeklyVolume()), 200);
  });
}

export function generateMockWeeklyVolumeHistory(
  years = 20,
): WeeklyVolumePoint[] {
  const weeks: WeeklyVolumePoint[] = [];
  const total = years * 52;
  for (let i = 0; i < total; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (total - 1 - i) * 7);
    const week = date.toISOString().slice(0, 10);
    weeks.push({ week, miles: Math.round(20 + Math.random() * 30) });
  }
  return weeks;
}

export async function getWeeklyVolumeHistory(
  years = 20,
): Promise<WeeklyVolumePoint[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockWeeklyVolumeHistory(years)), 200);
  });
}

export interface RunBikeVolumePoint {
  week: string;
  runMiles: number;
  bikeMiles: number;
  runTime: number;
  bikeTime: number;
}

export function generateMockRunBikeVolume(): RunBikeVolumePoint[] {
  const weeks: RunBikeVolumePoint[] = [];
  for (let i = 0; i < 26; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (25 - i) * 7);
    const week = date.toISOString().slice(0, 10);
    const runMiles = Math.round(10 + Math.random() * 20);
    const bikeMiles = Math.round(20 + Math.random() * 40);
    const runTime = Math.round(runMiles * (8 + Math.random() * 2));
    const bikeTime = Math.round(bikeMiles * (3 + Math.random()));
    weeks.push({ week, runMiles, bikeMiles, runTime, bikeTime });
  }
  return weeks;
}

export async function getRunBikeVolume(): Promise<RunBikeVolumePoint[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRunBikeVolume()), 200);
  });
}

export interface MileageTimelinePoint {
  /** ISO date for the activity */
  date: string;
  /** Distance covered in miles */
  miles: number;
  /** Array of [lng, lat] coordinates representing the path */
  coordinates: [number, number][];
}

export function generateMockMileageTimeline(
  years = 20,
): MileageTimelinePoint[] {
  const points: MileageTimelinePoint[] = [];
  const now = new Date();
  const start = new Date();
  start.setFullYear(start.getFullYear() - years);

  // Generate a handful of activities per year within the allowed range
  for (let y = 0; y < years; y++) {
    for (let i = 0; i < 5; i++) {
      const d = new Date(now);
      d.setFullYear(now.getFullYear() - y);
      d.setMonth(Math.floor(Math.random() * 12));
      d.setDate(1 + Math.floor(Math.random() * 28));
      const miles = +(3 + Math.random() * 10).toFixed(2);
      const coordinates: [number, number][] = [
        [-122.5 + Math.random() * 0.1, 37.7 + Math.random() * 0.1],
        [-122.4 + Math.random() * 0.1, 37.8 + Math.random() * 0.1],
      ];
      points.push({
        date: d.toISOString().slice(0, 10),
        miles,
        coordinates,
      });
    }
  }

  // Only keep activities within the requested time range
  return points
    .filter((p) => new Date(p.date) >= start)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getMileageTimeline(
  years = 20,
): Promise<MileageTimelinePoint[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockMileageTimeline(years)), 200);
  });
}

// ----- Weekly comparison metrics -----
function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

function generateWeek(start: Date): WeeklyMetricPoint[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return {
      date: d.toISOString().slice(0, 10),
      value: Math.round(50 + Math.random() * 50),
    };
  });
}

export async function getCurrentWeek(
  _metric: string,
): Promise<WeeklyMetricPoint[]> {
  return new Promise((resolve) => {
    const start = startOfWeek(new Date());
    setTimeout(() => resolve(generateWeek(start)), 150);
  });
}

export async function getPreviousWeek(
  _metric: string,
): Promise<WeeklyMetricPoint[]> {
  return new Promise((resolve) => {
    const start = startOfWeek(new Date());
    start.setDate(start.getDate() - 7);
    setTimeout(() => resolve(generateWeek(start)), 150);
  });
}

export async function getSameWeekLastYear(
  _metric: string,
): Promise<WeeklyMetricPoint[]> {
  return new Promise((resolve) => {
    const start = startOfWeek(new Date());
    start.setFullYear(start.getFullYear() - 1);
    setTimeout(() => resolve(generateWeek(start)), 150);
  });
}

// ----- Benchmark stats -----
export interface BenchmarkPoint {
  date: string;
  /** User value for the metric on this date */
  user: number;
  /** 50th percentile for the cohort */
  p50: number;
  /** 75th percentile for the cohort */
  p75: number;
  /** 90th percentile for the cohort */
  p90: number;
}

export interface BenchmarkStats {
  pace: BenchmarkPoint[];
  load: BenchmarkPoint[];
}

export function generateMockBenchmarkStats(): BenchmarkStats {
  const pace: BenchmarkPoint[] = [];
  const load: BenchmarkPoint[] = [];
  for (let i = 0; i < 28; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (27 - i));

    const p50Pace = +(7.5 + Math.random() * 0.2).toFixed(2);
    const p75Pace = +(7.2 + Math.random() * 0.2).toFixed(2);
    const p90Pace = +(6.8 + Math.random() * 0.2).toFixed(2);
    const userPace = +(p90Pace + Math.random() * 0.6).toFixed(2);

    const p50Load = +(1.2 + Math.random() * 0.1).toFixed(2);
    const p75Load = +(1.5 + Math.random() * 0.1).toFixed(2);
    const p90Load = +(2.0 + Math.random() * 0.1).toFixed(2);
    const userLoad = +(1.3 + Math.random() * 0.5).toFixed(2);

    const iso = date.toISOString().slice(0, 10);
    pace.push({
      date: iso,
      user: userPace,
      p50: p50Pace,
      p75: p75Pace,
      p90: p90Pace,
    });
    load.push({
      date: iso,
      user: userLoad,
      p50: p50Load,
      p75: p75Load,
      p90: p90Load,
    });
  }
  return { pace, load };
}

export const mockBenchmarkStats: BenchmarkStats = generateMockBenchmarkStats();

export async function getBenchmarkStats(): Promise<BenchmarkStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockBenchmarkStats()), 300);
  });
}

// ----- Running session similarity -----

export interface RunningSession {
  id: number;
  pace: number;
  duration: number;
  heartRate: number;
  date: string;

  /** ISO timestamp for session start */
  start?: string;
  lat: number;
  lon: number;
  weather: {
    temperature: number;
    humidity: number;
    wind: number;
    condition: string;
  };
}

export function generateMockRunningSessions(): RunningSession[] {
  const coords = [
    { lat: 40.7128, lon: -74.006 }, // New York
    { lat: 34.0522, lon: -118.2437 }, // Los Angeles
    { lat: 41.8781, lon: -87.6298 }, // Chicago
    { lat: 47.6062, lon: -122.3321 }, // Seattle
    { lat: 29.7604, lon: -95.3698 }, // Houston
  ]

  const conditions = [
    "Clear",
    "Cloudy",
    "Fog",
    "Drizzle",
    "Rain",
    "Snow",
    "Storm",
  ];

  return Array.from({ length: 30 }, (_, i) => {
    const pace =
      i % 5 === 0
        ? +(4.5 + Math.random() * 0.5).toFixed(2)
        : +(6 + Math.random() * 2).toFixed(2);
    const base = new Date();
    base.setDate(base.getDate() - i);
    const startHour = 5 + Math.round(Math.random() * 14); // 5 AM - 7 PM
    base.setHours(startHour, 0, 0, 0);
    const { lat, lon } = coords[i % coords.length];
    return {
      id: i + 1,
      pace,
      duration: Math.round(25 + Math.random() * 35),
      heartRate: Math.round(120 + Math.random() * 40),
      date: base.toISOString().slice(0, 10),
      start: base.toISOString(),
      lat,
      lon,
      weather: {
        temperature: Math.round(45 + Math.random() * 40),
        humidity: Math.round(30 + Math.random() * 60),
        wind: Math.round(Math.random() * 15),
        condition: conditions[i % conditions.length],
      },
    };
  });

}

let sessionCache: RunningSession[] | null = null;

export async function getRunningSessions(): Promise<RunningSession[]> {
  if (sessionCache) return sessionCache;
  const sessions = generateMockRunningSessions();
  try {
    const weather = await getWeatherForRuns(
      sessions.map((s) => ({ date: s.date, lat: s.lat, lon: s.lon })),
    );
    const map: Record<string, DailyWeather> = {};
    weather.forEach((w) => {
      map[w.date] = w;
    });
    sessions.forEach((s) => {
      const w = map[s.date];
      if (w && (w.temperature || w.humidity || w.wind)) {
        s.weather = {
          temperature: w.temperature,
          humidity: w.humidity,
          wind: w.wind,
          condition: w.condition,
        };
      }
    });
  } catch {
    // ignore errors so dashboards still load
  }
  sessionCache = sessions;
  return sessions;
}

export function addRunningSession(run: RunningSession): void {
  if (sessionCache) sessionCache = [...sessionCache, run];
  else sessionCache = [run];
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("runningSessionsUpdated"));
  }
}

function isPresent(v: unknown) {
  return v !== null && v !== undefined && !(typeof v === "number" && isNaN(v));
}

function baselineConfidence(s: RunningSession): number {
  const baseFields = [s.pace, s.duration, s.heartRate, s.start ?? s.date, s.lat, s.lon];
  const completeness = baseFields.filter(isPresent).length / baseFields.length;
  const weatherFields = [s.weather.temperature, s.weather.humidity, s.weather.wind];
  const weatherAccuracy = weatherFields.filter(isPresent).length / weatherFields.length;
  return +(0.5 * completeness + 0.5 * weatherAccuracy).toFixed(2);
}

function expectedPace(s: RunningSession): number {
  const hour = new Date(s.start ?? s.date).getHours();
  const temp = s.weather.temperature || 55;
  const humidity = s.weather.humidity || 50;
  const wind = s.weather.wind || 0;
  const tempAdj = (temp - 55) * 0.02;
  const humidAdj = (humidity - 50) * 0.01;
  const windAdj = wind * 0.01;
  const conditionAdjMap: Record<string, number> = {
    Clear: -0.05,
    Cloudy: 0.02,
    Fog: 0.05,
    Drizzle: 0.07,
    Rain: 0.1,
    Snow: 0.15,
    Storm: 0.2,
  };
  const conditionAdj = conditionAdjMap[s.weather.condition] ?? 0;
  const timeAdj = Math.abs(hour - 8) * 0.03;
  const hrAdj = (s.heartRate - 140) * 0.015;
  return 6.5 + tempAdj + humidAdj + windAdj + conditionAdj + timeAdj + hrAdj;
}

export interface GoodDaySession {
  id: number;
  start: string;
  pace: number;
  paceDelta: number;
  tags: string[];
  confidence: number;
}

export async function getGoodDaySessions(
  options?: { tags?: string[] },
): Promise<GoodDaySession[]> {
  const sessions = await getRunningSessions();
  const metaMap = getAllSessionMeta();
  return sessions
    .map((s) => {
      const meta = metaMap[s.id] || {
        tags: [],
        isFalsePositive: false,
        feltHarder: false,
      };
      const paceDelta = +(expectedPace(s) - s.pace).toFixed(2);
      return {
        id: s.id,
        start: s.start ?? s.date,
        pace: s.pace,
        paceDelta,
        tags: meta.tags,
        confidence: baselineConfidence(s),
        isFalsePositive: meta.isFalsePositive,
      };
    })
    .filter(
      (s) =>
        s.paceDelta > 0 &&
        !s.isFalsePositive &&
        (!options?.tags || options.tags.every((t) => s.tags.includes(t))),
    )
    .map(({ isFalsePositive, ...rest }) => rest);
}

export interface PaceDeltaBenchmark {
  p50: number;
  p75: number;
  p90: number;
}

export async function getPaceDeltaBenchmark(): Promise<PaceDeltaBenchmark> {
  const sessions = await getGoodDaySessions();
  const deltas = sessions.map((s) => s.paceDelta).sort((a, b) => a - b);

  function quantile(p: number) {
    if (deltas.length === 0) return 0;
    const pos = (deltas.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    const next = deltas[base + 1] ?? deltas[base];
    return +(deltas[base] + rest * (next - deltas[base])).toFixed(2);
  }

  return { p50: quantile(0.5), p75: quantile(0.75), p90: quantile(0.9) };
}

export interface PaceWeatherPoint {
  /** minutes from start */
  t: number;
  /** actual pace at time t */
  actual: number;
  /** expected baseline pace */
  expected: number;
  /** temperature at time t */
  temperature: number;
}

export async function getSessionTimeseries(
  id: number,
): Promise<PaceWeatherPoint[]> {
  const sessions = await getRunningSessions();
  const s = sessions.find((r) => r.id === id);
  if (!s) return [];

  function expectedPace(rs: RunningSession): number {
    const hour = new Date(rs.start ?? rs.date).getHours();
    const temp = rs.weather.temperature || 55;
    const humidity = rs.weather.humidity || 50;
    const wind = rs.weather.wind || 0;
    const tempAdj = (temp - 55) * 0.02;
    const humidAdj = (humidity - 50) * 0.01;
    const windAdj = wind * 0.01;
    const conditionAdjMap: Record<string, number> = {
      Clear: -0.05,
      Cloudy: 0.02,
      Fog: 0.05,
      Drizzle: 0.07,
      Rain: 0.1,
      Snow: 0.15,
      Storm: 0.2,
    };
    const conditionAdj = conditionAdjMap[rs.weather.condition] ?? 0;
    const timeAdj = Math.abs(hour - 8) * 0.03;
    const hrAdj = (rs.heartRate - 140) * 0.015;
    return 6.5 + tempAdj + humidAdj + windAdj + conditionAdj + timeAdj + hrAdj;
  }

  const expected = expectedPace(s);
  const minutes = Math.min(s.duration, 30);
  const series: PaceWeatherPoint[] = [];
  for (let i = 0; i < minutes; i++) {
    const actual = +(s.pace + (Math.random() - 0.5) * 0.5).toFixed(2);
    const temperature =
      s.weather.temperature + Math.round((Math.random() - 0.5) * 4);
    series.push({ t: i, actual, expected, temperature });
  }
  return series;
}

export interface RouteProfilePoint {
  distance: number;
  elevation: number;
}

export interface RouteSession {
  id: number;
  route: string;
  date: string;
  profile: RouteProfilePoint[];
  paceDistribution: PaceDistributionBin[];
}

export function generateMockRouteSessions(
  route = "River Loop",
): RouteSession[] {
  return Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    route,
    date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    profile: Array.from({ length: 8 }, (__, j) => ({
      distance: j,
      elevation: 20 * Math.sin(j / 2) + Math.random() * 5,
    })),
    paceDistribution: Array.from({ length: 5 }, (__, j) => ({
      bin: `${5 + j}:00`,
      upper: Math.round(Math.random() * 8 + 2),
      lower: 0,
    })),
  }));
}

export async function getRouteSessions(route: string): Promise<RouteSession[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRouteSessions(route)), 200);
  });
}

// ----- Route similarity -----

export interface LatLon {
  lat: number;
  lon: number;
}

export interface Route {
  name: string;
  points: LatLon[];
}

const mockMadisonRoutes: Route[] = [
  {
    name: "Lake Mendota Loop",
    points: [
      { lat: 43.079, lon: -89.4 },
      { lat: 43.0794, lon: -89.3992 },
      { lat: 43.0798, lon: -89.3984 },
      { lat: 43.0802, lon: -89.3976 },
      { lat: 43.0806, lon: -89.3968 },
      { lat: 43.081, lon: -89.396 },
      { lat: 43.0814, lon: -89.3952 },
      { lat: 43.0818, lon: -89.3944 },
      { lat: 43.0822, lon: -89.3936 },
      { lat: 43.0826, lon: -89.3928 },
      { lat: 43.083, lon: -89.392 },
      { lat: 43.0826, lon: -89.392 },
      { lat: 43.0822, lon: -89.392 },
      { lat: 43.0818, lon: -89.392 },
      { lat: 43.0814, lon: -89.392 },
      { lat: 43.081, lon: -89.392 },
      { lat: 43.0806, lon: -89.392 },
      { lat: 43.0802, lon: -89.392 },
      { lat: 43.0798, lon: -89.392 },
      { lat: 43.0794, lon: -89.392 },
      { lat: 43.079, lon: -89.392 },
      { lat: 43.0786, lon: -89.3926 },
      { lat: 43.0782, lon: -89.3932 },
      { lat: 43.0778, lon: -89.3938 },
      { lat: 43.0774, lon: -89.3944 },
      { lat: 43.077, lon: -89.395 },
      { lat: 43.0766, lon: -89.3956 },
      { lat: 43.0762, lon: -89.3962 },
      { lat: 43.0758, lon: -89.3968 },
      { lat: 43.0754, lon: -89.3974 },
      { lat: 43.075, lon: -89.398 },
      { lat: 43.0754, lon: -89.3982 },
      { lat: 43.0758, lon: -89.3984 },
      { lat: 43.0762, lon: -89.3986 },
      { lat: 43.0766, lon: -89.3988 },
      { lat: 43.077, lon: -89.399 },
      { lat: 43.0774, lon: -89.3992 },
      { lat: 43.0778, lon: -89.3994 },
      { lat: 43.0782, lon: -89.3996 },
      { lat: 43.0786, lon: -89.3998 },
      { lat: 43.079, lon: -89.4 },
    ],
  },
  {
    name: "Capitol Square Loop",
    points: [
      { lat: 43.074, lon: -89.384 },
      { lat: 43.0745, lon: -89.3848 },
      { lat: 43.075, lon: -89.3856 },
      { lat: 43.0755, lon: -89.3864 },
      { lat: 43.076, lon: -89.3872 },
      { lat: 43.0765, lon: -89.388 },
      { lat: 43.077, lon: -89.3888 },
      { lat: 43.0775, lon: -89.3896 },
      { lat: 43.078, lon: -89.3904 },
      { lat: 43.0785, lon: -89.3912 },
      { lat: 43.079, lon: -89.392 },
      { lat: 43.0787, lon: -89.3927 },
      { lat: 43.0784, lon: -89.3934 },
      { lat: 43.0781, lon: -89.3941 },
      { lat: 43.0778, lon: -89.3948 },
      { lat: 43.0775, lon: -89.3955 },
      { lat: 43.0772, lon: -89.3962 },
      { lat: 43.0769, lon: -89.3969 },
      { lat: 43.0766, lon: -89.3976 },
      { lat: 43.0763, lon: -89.3983 },
      { lat: 43.076, lon: -89.399 },
      { lat: 43.0756, lon: -89.3982 },
      { lat: 43.0752, lon: -89.3974 },
      { lat: 43.0748, lon: -89.3966 },
      { lat: 43.0744, lon: -89.3958 },
      { lat: 43.074, lon: -89.395 },
      { lat: 43.0736, lon: -89.3942 },
      { lat: 43.0732, lon: -89.3934 },
      { lat: 43.0728, lon: -89.3926 },
      { lat: 43.0724, lon: -89.3918 },
      { lat: 43.072, lon: -89.391 },
      { lat: 43.0722, lon: -89.3903 },
      { lat: 43.0724, lon: -89.3896 },
      { lat: 43.0726, lon: -89.3889 },
      { lat: 43.0728, lon: -89.3882 },
      { lat: 43.073, lon: -89.3875 },
      { lat: 43.0732, lon: -89.3868 },
      { lat: 43.0734, lon: -89.3861 },
      { lat: 43.0736, lon: -89.3854 },
      { lat: 43.0738, lon: -89.3847 },
      { lat: 43.074, lon: -89.384 },
    ],
  },
  {
    name: "Monona Bay Loop",
    points: [
      { lat: 43.067, lon: -89.395 },
      { lat: 43.068, lon: -89.392 },
      { lat: 43.069, lon: -89.389 },
    ],
  },
  {
    name: "UW Arboretum Ride",
    points: [
      { lat: 43.047, lon: -89.429 },
      { lat: 43.0485, lon: -89.423 },
      { lat: 43.05, lon: -89.417 },
    ],
  },
];

const uploadedRoutes: Route[] = [];

export async function saveRoute(route: Route): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      uploadedRoutes.push({ ...route, points: [...route.points] });
      resolve();
    }, 100);
  });
}

export async function getMockRoutes(): Promise<Route[]> {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve([
          ...mockMadisonRoutes.map((r) => ({ ...r, points: [...r.points] })),
          ...uploadedRoutes.map((r) => ({ ...r, points: [...r.points] })),
        ]),
      200,
    );
  });
}

export interface RouteRun {
  id: number;
  name: string;
  timestamp: string;
  points: LatLon[];
  novelty: number;
  dtwSimilarity: number;
  overlapSimilarity: number;
}

export function computeRouteNovelty(
  route: LatLon[],
  history: LatLon[][],
): { novelty: number; dtwSimilarity: number; overlapSimilarity: number } {
  if (history.length === 0) {
    return { novelty: 1, dtwSimilarity: 0, overlapSimilarity: 0 };
  }
  let maxSim = 0;
  let bestDtw = 0;
  let bestOverlap = 0;
  for (const h of history) {
    const { overlapSimilarity, dtwSimilarity, maxSimilarity } =
      computeRouteMetrics(route, h);
    if (maxSimilarity > maxSim) {
      maxSim = maxSimilarity;
      bestDtw = dtwSimilarity;
      bestOverlap = overlapSimilarity;
    }
  }
  return {
    novelty: 1 - maxSim,
    dtwSimilarity: bestDtw,
    overlapSimilarity: bestOverlap,
  };
}


let nextRouteRunId = 1;
const routeHistory: RouteRun[] = [];
let historySeeded = false;

export async function seedRouteRuns(): Promise<void> {
  if (historySeeded) return;
  const runs = await fetchRouteRunHistory();
  routeHistory.push(...runs);
  nextRouteRunId =
    runs.reduce((max, r) => Math.max(max, r.id), 0) + 1;
  historySeeded = true;
}

export async function recordRouteRun(points: LatLon[]): Promise<RouteRun> {
  await seedRouteRuns();
  const { novelty, dtwSimilarity, overlapSimilarity } = computeRouteNovelty(
    points,
    routeHistory.map((r) => r.points),
  );

  const run: RouteRun = {
    id: nextRouteRunId,
    name: `Run ${nextRouteRunId}`,
    timestamp: new Date().toISOString(),
    points,
    novelty,

    dtwSimilarity,
    overlapSimilarity,

  };

  nextRouteRunId++;
  routeHistory.push(run);

  await trackRouteRun(run);

  return run;
}

export async function getRouteRunHistory(): Promise<RouteRun[]> {
  await seedRouteRuns();
  return fetchRouteRunHistory();
}

export function resetRouteHistory(): void {
  routeHistory.length = 0;
  nextRouteRunId = 1;
  historySeeded = false;
  resetRouteRuns();
}

// ----- Sleep sessions -----

export interface SleepSession {
  date: string;
  timeInBed: number;
}

export function generateMockSleepSessions(days = 30): SleepSession[] {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return {
      date: d.toISOString().slice(0, 10),
      timeInBed: +(6 + Math.random() * 3).toFixed(2),
    };
  });
}

export async function getSleepSessions(): Promise<SleepSession[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockSleepSessions()), 200);
  });
}

// ----- Location efficiency -----

export interface LocationEfficiency {
  state: string;
  city: string;
  distance: number;
  pace: number;
  effort: number;
}

export const mockLocationEfficiency: LocationEfficiency[] = [
  {
    state: "CA",
    city: "Los Angeles",
    distance: 10,
    pace: 8,
    effort: 80,
  },
  {
    state: "CA",
    city: "San Francisco",
    distance: 8,
    pace: 7.5,
    effort: 60,
  },
  {
    state: "TX",
    city: "Austin",
    distance: 6,
    pace: 7,
    effort: 42,
  },
  {
    state: "TX",
    city: "Houston",
    distance: 5,
    pace: 8,
    effort: 40,
  },
];

export async function getLocationEfficiency(): Promise<LocationEfficiency[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockLocationEfficiency), 200);
  });
}

// ----- Reading probability timeline -----
export type ReadingProbabilityPoint = {
  time: string;
  probability: number;
  intensity: number;
  avgDuration: number;
  label: string;
};

function labelForIntensity(intensity: number): string {
  if (intensity > 0.66) return "Deep Dive";
  if (intensity > 0.33) return "Skim";
  if (intensity > 0) return "Page Turn Panic";
  return "";
}

export function generateMockReadingProbability(): ReadingProbabilityPoint[] {
  return Array.from({ length: 24 }, (_, i) => {
    const d = new Date();
    d.setHours(i, 0, 0, 0);

    let probability: number;
    // Early morning: very low probability (early run, no reading)
    if (i < 6) {
      probability = 0.05 + Math.random() * 0.05;
    }
    // Morning hours after the run: still quite low
    else if (i < 9) {
      probability = 0.1 + Math.random() * 0.05;
    }
    // Daytime: occasional short reading sessions
    else if (i < 17) {
      probability = 0.1 + Math.random() * 0.15;
    }
    // Evening: primary reading time
    else if (i < 22) {
      probability = 0.6 + Math.random() * 0.3;
    }
    // Late night wind down
    else {
      probability = 0.4 + Math.random() * 0.2;
    }

    // Intensity loosely correlates with probability
    const intensity = probability * (0.5 + Math.random() * 0.5);
    const avgDuration = 5 + Math.random() * 55;

    return {
      time: d.toISOString(),
      probability: +probability.toFixed(2),
      intensity: +intensity.toFixed(2),
      avgDuration: Math.round(avgDuration),
      label: labelForIntensity(intensity),
    };
  });
}

export async function getReadingProbability(): Promise<
  ReadingProbabilityPoint[]
> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockReadingProbability()), 200);
  });
}

// ----- Reading sessions -----

export type ReadingMedium =
  | "phone"
  | "computer"
  | "tablet"
  | "kindle"
  | "real_book"
  | "other";

export interface ReadingSession {
  /** ISO timestamp when reading occurred */
  timestamp: string;
  /** Focus intensity from 0-1 */
  intensity: number;
  /** Device or medium used for the session */
  medium: ReadingMedium;
  /** Duration of the session in minutes */
  duration: number;
}


export function generateMockReadingSessions(count = 60): ReadingSession[] {
  const sessions: ReadingSession[] = [];
  const mediums: ReadingMedium[] = [
    "phone",
    "computer",
    "tablet",
    "kindle",
    "real_book",
    "other",
  ];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    d.setHours(Math.floor(Math.random() * 24), 0, 0, 0);
    sessions.push({
      timestamp: d.toISOString(),
      intensity: +Math.random().toFixed(2),
      medium: mediums[Math.floor(Math.random() * mediums.length)],
      duration: Math.floor(5 + Math.random() * 55),
    });
  }
  return sessions;
}

export async function getReadingSessions(
  signal?: AbortSignal,
): Promise<ReadingSession[]> {
  const sessions = await getKindleSessions(signal);
  return sessions.map((s) => ({
    timestamp: s.start,
    intensity: s.duration ? Math.min(1, (s.highlights || 0) / s.duration) : 0,
    medium: "kindle" as ReadingMedium,
    duration: s.duration,
  }));

}

export interface ReadingMediumTotal {
  medium: ReadingMedium;
  minutes: number;
}

export function aggregateReadingMediumTotals(
  sessions: ReadingSession[],
): ReadingMediumTotal[] {
  const totals: Record<ReadingMedium, number> = {
    phone: 0,
    computer: 0,
    tablet: 0,
    kindle: 0,
    real_book: 0,
    other: 0,
  };
  sessions.forEach((s) => {
    totals[s.medium] += s.duration;
  });
  return (Object.keys(totals) as ReadingMedium[]).map((m) => ({
    medium: m,
    minutes: totals[m],
  }));
}

export async function getReadingMediumTotals(): Promise<ReadingMediumTotal[]> {
  try {
    const sessions = await getReadingSessions();
    return aggregateReadingMediumTotals(sessions);
  } catch (err) {
    console.error("Failed to load reading medium totals", err);
    return aggregateReadingMediumTotals([]);
  }
}

export interface DailyReadingStat {
  date: string;
  minutes: number;
  pages: number;
}

export async function getDailyReadingStats(): Promise<DailyReadingStat[]> {
  if (typeof fetch === 'function') {
    try {
      const res = await fetch('/api/kindle/daily-stats');
      if (res.ok) {
        return res.json();
      }
    } catch {
      // ignore and fall back
    }
  }
  return dailyReadingData;
}

export interface KindleSession {
  start: string;
  end: string;
  asin: string;
  title: string;
  duration: number;
  highlights: number;
}

export async function getKindleSessions(
  signal?: AbortSignal
): Promise<KindleSession[]> {
  if (typeof fetch === "function") {
    try {
      const res = await fetch("/api/kindle/sessions", {
        ...(signal ? { signal } : {}),
      });
      if (res.ok) {
        return res.json();
      }
      console.warn(
        `Failed to fetch Kindle sessions: ${res.status} ${res.statusText}. Using local data.`,
      );
    } catch (err: any) {
      if (err.name === "AbortError") throw err;
      console.warn("Failed to fetch Kindle sessions, using local data:", err);
    }
  }

  return sessionData.map((s) => ({
    ...s,
    title: (asinTitleMap as Record<string, string>)[s.asin] ?? s.asin,
  }));
}

// ----- Focus sessions -----

export type FocusLabel = "Deep Dive" | "Skim" | "Page Turn Panic";

export interface FocusSession {
  /** ISO timestamp when the session started */
  start: string;
  /** Duration of the session in minutes */
  duration: number;
  /** Focus label describing the session */
  label: FocusLabel;
}

export function generateMockFocusSessions(count = 40): FocusSession[] {
  const labels: FocusLabel[] = ["Deep Dive", "Skim", "Page Turn Panic"];
  const sessions: FocusSession[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() - Math.floor(Math.random() * 30));
    d.setHours(Math.floor(Math.random() * 24), 0, 0, 0);
    sessions.push({
      start: d.toISOString(),
      duration: Math.floor(5 + Math.random() * 55),
      label: labels[Math.floor(Math.random() * labels.length)],
    });
  }
  return sessions;
}

export async function getFocusSessions(): Promise<FocusSession[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockFocusSessions()), 200);
  });
}

// ----- Reading progress -----
export interface ReadingProgress {
  pagesRead: number;
  readingGoal: number;
}

export const mockReadingProgress: ReadingProgress = {
  pagesRead: 120,
  readingGoal: 300,
};

export async function getReadingProgress(): Promise<ReadingProgress> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReadingProgress), 200);
  });
}

// ----- Recent run window -----
export interface RunWindow {
  start: string;
  end: string;
}

export async function getLatestRun(): Promise<RunWindow> {
  return new Promise((resolve) => {
    const end = new Date();
    const duration = 30 + Math.floor(Math.random() * 30);
    const start = new Date(end.getTime() - duration * 60000);
    setTimeout(
      () => resolve({ start: start.toISOString(), end: end.toISOString() }),
      100,
    );
  });
}



// ----- Wild schedule -----
export interface WildGame {
  gameDate: string;
  opponent: string;
  home: boolean;
  /** URL to stream or watch the game */
  watchUrl: string;
}

const mockWildSchedule: WildGame[] = [
  {
    gameDate: "2025-10-01T00:00:00Z",
    opponent: "Blues",
    home: true,
    watchUrl: "https://www.nhl.com/wild/live",
  },
  {
    gameDate: "2025-10-03T00:00:00Z",
    opponent: "Blackhawks",
    home: false,
    watchUrl: "https://www.nhl.com/wild/live",
  },
  {
    gameDate: "2025-10-05T00:00:00Z",
    opponent: "Avalanche",
    home: true,
    watchUrl: "https://www.nhl.com/wild/live",
  },
];

export async function getWildSchedule(
  limit = mockWildSchedule.length,
): Promise<WildGame[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockWildSchedule.slice(0, limit)), 100);
  });
}



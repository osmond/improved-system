import type { DailyWeather } from "./weatherApi";

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
  { activity: "Swim", minutes: 120, fill: "var(--color-swim)" },
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
}

export function generateMockActivitySnapshots(days = 30): ActivitySnapshot[] {
  const data: ActivitySnapshot[] = [];
  for (let i = 0; i < days; i++) {
    const base = new Date();
    base.setDate(base.getDate() - i);
    for (let h = 0; h < 24; h++) {
      const d = new Date(base);
      d.setHours(h, 0, 0, 0);
      data.push({
        timestamp: d.toISOString(),
        heartRate: Math.round(60 + Math.random() * 40),
        steps: Math.floor(50 + Math.random() * 450),
      });
    }
  }
  return data;
}

export async function getActivitySnapshots(
  days = 30,
): Promise<ActivitySnapshot[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockActivitySnapshots(days)), 200);
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
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRunningStats()), 300);
  });
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
}

export function generateMockRunningSessions(): RunningSession[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    pace: +(5 + Math.random() * 3).toFixed(2),
    duration: Math.round(25 + Math.random() * 35),
    heartRate: Math.round(120 + Math.random() * 40),
    date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  }));
}

export async function getRunningSessions(): Promise<RunningSession[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRunningSessions()), 200);
  });
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
};

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

    return {
      time: d.toISOString(),
      probability: +probability.toFixed(2),
      intensity: +intensity.toFixed(2),
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

export async function getReadingSessions(): Promise<ReadingSession[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockReadingSessions()), 200);
  });
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
  return new Promise((resolve) => {
    setTimeout(() => {
      const sessions = generateMockReadingSessions();
      resolve(aggregateReadingMediumTotals(sessions));
    }, 200);
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



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

export interface SeasonalBaseline {
  /** Month number 1-12 */
  month: number
  /** Expected minimum value for the month */
  min: number
  /** Expected maximum value for the month */
  max: number
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
]

export async function getSeasonalBaselines(): Promise<SeasonalBaseline[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockSeasonalBaselines), 200)
  })
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
      resolve({ ...mockGarminData, lastSync: new Date().toISOString() })
    }, 500)
  })
}
export async function getDailySteps(): Promise<GarminDay[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDailySteps), 300);
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
  bin: string
  upper: number
  lower: number
}

export interface HeartRateZoneData {
  zone: string
  count: number
}

export interface PaceHeartPoint {
  pace: number
  heartRate: number
}

export interface TempBucket {
  label: string
  count: number
}

export interface WeatherCondition {
  label: string
  count: number
}

export interface AnnualMileage {
  year: number
  totalMiles: number
}

export interface HourActivity {
  hour: number
  pct: number
}

export interface WeekdayMileage {
  day: string
  pct: number
}

export interface DistanceBucket {
  label: string
  count: number
}

export interface TreadmillOutdoor {
  outdoor: number
  treadmill: number
}

export interface RunningStats {
  paceDistribution: PaceDistributionBin[]
  heartRateZones: HeartRateZoneData[]
  paceVsHeart: PaceHeartPoint[]
  temperature: TempBucket[]
  weatherConditions: WeatherCondition[]
  annualMileage: AnnualMileage[]
  byHour: HourActivity[]
  byWeekday: WeekdayMileage[]
  distanceBuckets: DistanceBucket[]
  treadmillOutdoor: TreadmillOutdoor
}

export function generateMockRunningStats(): RunningStats {
  const paceDistribution: PaceDistributionBin[] = []
  for (let i = 0; i < 10; i++) {
    const minutes = 5 + i * 0.5
    const m = Math.floor(minutes)
    const s = Math.round((minutes - m) * 60)
    const bin = `${m}:${s.toString().padStart(2, '0')}`
    const value = Math.round(Math.random() * 8 + 2)
    paceDistribution.push({ bin, upper: value, lower: -value })
  }

  const heartRateZones: HeartRateZoneData[] = [
    { zone: 'Z1', count: 20 },
    { zone: 'Z2', count: 40 },
    { zone: 'Z3', count: 30 },
    { zone: 'Z4', count: 15 },
    { zone: 'Z5', count: 5 },
  ]

  const paceVsHeart: PaceHeartPoint[] = Array.from({ length: 30 }, () => {
    const pace = +(5 + Math.random() * 4).toFixed(2)
    const heartRate = Math.round(130 + (10 - pace) * 10 + Math.random() * 5)
    return { pace, heartRate }
  })

  const temperature: TempBucket[] = [
    { label: '40-50', count: 3 },
    { label: '50-60', count: 8 },
    { label: '60-70', count: 12 },
    { label: '70-80', count: 6 },
    { label: '80-90', count: 2 },
  ]

  const weatherConditions: WeatherCondition[] = [
    { label: 'Sunny', count: 15 },
    { label: 'Cloudy', count: 8 },
    { label: 'Rain', count: 4 },
    { label: 'Snow', count: 1 },
  ]

  const currentYear = new Date().getFullYear()
  const annualMileage: AnnualMileage[] = []
  for (let year = currentYear - 5; year <= currentYear; year++) {
    annualMileage.push({ year, totalMiles: 800 + Math.round(Math.random() * 700) })
  }

  const byHour: HourActivity[] = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    pct: Math.round(Math.random() * 10),
  }))

  const byWeekday: WeekdayMileage[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
    (day) => ({ day, pct: Math.round(Math.random() * 20) })
  )

  const distanceBuckets: DistanceBucket[] = [
    { label: '0-3', count: 4 },
    { label: '3-6', count: 10 },
    { label: '6-9', count: 8 },
    { label: '9-12', count: 5 },
    { label: '12+', count: 2 },
  ]

  const treadmillOutdoor: TreadmillOutdoor = { outdoor: 80, treadmill: 20 }

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
  }
}

export const mockRunningStats: RunningStats = generateMockRunningStats()

export async function getRunningStats(
  _range?: { start?: string | null; end?: string | null }
): Promise<RunningStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRunningStats()), 300)
  })
}

export interface WeeklyVolumePoint {
  week: string
  miles: number
}

export function generateMockWeeklyVolume(): WeeklyVolumePoint[] {
  const weeks: WeeklyVolumePoint[] = []
  for (let i = 0; i < 26; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (25 - i) * 7)
    const week = date.toISOString().slice(0, 10)
    weeks.push({ week, miles: Math.round(20 + Math.random() * 30) })
  }
  return weeks
}

export async function getWeeklyVolume(): Promise<WeeklyVolumePoint[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockWeeklyVolume()), 200)
  })
}

export interface RunBikeVolumePoint {
  week: string
  runMiles: number
  bikeMiles: number
  runTime: number
  bikeTime: number
}

export function generateMockRunBikeVolume(): RunBikeVolumePoint[] {
  const weeks: RunBikeVolumePoint[] = []
  for (let i = 0; i < 26; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (25 - i) * 7)
    const week = date.toISOString().slice(0, 10)
    const runMiles = Math.round(10 + Math.random() * 20)
    const bikeMiles = Math.round(20 + Math.random() * 40)
    const runTime = Math.round(runMiles * (8 + Math.random() * 2))
    const bikeTime = Math.round(bikeMiles * (3 + Math.random()))
    weeks.push({ week, runMiles, bikeMiles, runTime, bikeTime })
  }
  return weeks
}

export async function getRunBikeVolume(): Promise<RunBikeVolumePoint[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRunBikeVolume()), 200)
  })
}

// ----- Benchmark stats -----
export interface BenchmarkPoint {
  date: string
  /** User value for the metric on this date */
  user: number
  /** 50th percentile for the cohort */
  p50: number
  /** 75th percentile for the cohort */
  p75: number
  /** 90th percentile for the cohort */
  p90: number
}

export interface BenchmarkStats {
  pace: BenchmarkPoint[]
  load: BenchmarkPoint[]
}

export function generateMockBenchmarkStats(): BenchmarkStats {
  const pace: BenchmarkPoint[] = []
  const load: BenchmarkPoint[] = []
  for (let i = 0; i < 28; i++) {
    const date = new Date()
    date.setDate(date.getDate() - (27 - i))

    const p50Pace = +(7.5 + Math.random() * 0.2).toFixed(2)
    const p75Pace = +(7.2 + Math.random() * 0.2).toFixed(2)
    const p90Pace = +(6.8 + Math.random() * 0.2).toFixed(2)
    const userPace = +(p90Pace + Math.random() * 0.6).toFixed(2)

    const p50Load = +(1.2 + Math.random() * 0.1).toFixed(2)
    const p75Load = +(1.5 + Math.random() * 0.1).toFixed(2)
    const p90Load = +(2.0 + Math.random() * 0.1).toFixed(2)
    const userLoad = +(1.3 + Math.random() * 0.5).toFixed(2)

    const iso = date.toISOString().slice(0, 10)
    pace.push({ date: iso, user: userPace, p50: p50Pace, p75: p75Pace, p90: p90Pace })
    load.push({ date: iso, user: userLoad, p50: p50Load, p75: p75Load, p90: p90Load })
  }
  return { pace, load }
}

export const mockBenchmarkStats: BenchmarkStats = generateMockBenchmarkStats()

export async function getBenchmarkStats(): Promise<BenchmarkStats> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockBenchmarkStats()), 300)
  })
}

// ----- Running session similarity -----

export interface RunningSession {
  id: number
  pace: number
  duration: number
  heartRate: number
  date: string
}

export function generateMockRunningSessions(): RunningSession[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    pace: +(5 + Math.random() * 3).toFixed(2),
    duration: Math.round(25 + Math.random() * 35),
    heartRate: Math.round(120 + Math.random() * 40),
    date: new Date(Date.now() - i * 86400000)
      .toISOString()
      .slice(0, 10),
  }))
}

export async function getRunningSessions(): Promise<RunningSession[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRunningSessions()), 200)

  })
}

export interface RouteProfilePoint {
  distance: number
  elevation: number
}

export interface RouteSession {
  id: number
  route: string
  date: string
  profile: RouteProfilePoint[]
  paceDistribution: PaceDistributionBin[]
}

export function generateMockRouteSessions(route = 'River Loop'): RouteSession[] {
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
  }))
}

export async function getRouteSessions(route: string): Promise<RouteSession[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(generateMockRouteSessions(route)), 200)
  })
}

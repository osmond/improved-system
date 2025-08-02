# Dashboard

## Project structure & imports
Use the `src/components/ui` folder for all shared, “primitive” UI bits—buttons, cards, tabs, tooltips, charts, etc. This is where the Shadcn-CLI lives, and any one-off or feature-specific code goes elsewhere (e.g. `src/components/dashboard/StepsChart.tsx`).

Import via your `@/` alias (`import { Card } from "@/components/ui/card"`) so paths stay short and portable.
Make sure your `tsconfig.json` and `vite.config.ts` both have the same alias config:

```ts
// vite.config.ts
resolve: {
  alias: { "@": path.resolve(__dirname, "./src") },
}
```
```jsonc
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"] }
  }
}
```

## Theming & design tokens
All colours, spacings, radii, etc. should come from your CSS variables in `globals.css` (populated from `tailwind.config.js`’s `theme.extend`).

Add new tokens (e.g. `--chart-6`–`--chart-10`) in the same `:root { … }` block so everything—charts, rings, cards—uses the same palette.

Dark mode is driven via the `<html class="dark">` class and the corresponding `.dark { … }` overrides in `globals.css`.

## Component conventions
Re-use Shadcn primitives rather than rolling your own:

```tsx
<Button variant="outline" size="sm">Trends</Button>
```

```tsx
<button className="px-2 py-1 border rounded text-sm">Trends</button>
```

Forward refs & `cn()` wrappers: every `ui/...` component should use the `cn()` helper (in `src/lib/utils.ts`) to merge classNames and accept `className` as a prop.

Types first: Prop-type definitions should be explicit (e.g. `interface StepsChartProps { data: GarminDay[] }`).

## Sidebar features
The UI sidebar includes configurable behaviour:

- `SIDEBAR_WIDTH` and `SIDEBAR_WIDTH_MOBILE` control its width on desktop and mobile.
- `SIDEBAR_KEYBOARD_SHORTCUT` toggles the sidebar via a Cmd/Ctrl + key shortcut.
- The open state persists in the `SIDEBAR_COOKIE_NAME` cookie; the `SidebarProvider` `defaultOpen` prop sets the initial state.

See [`components/ui/sidebar.tsx`](components/ui/sidebar.tsx) for implementation details.

## State & data hooks
Keep all API-specific logic (auth, fetch, shape/normalize) inside `src/hooks/useGarminData.ts`. That way components stay pure/presentational.

In the handoff, document what shape `useGarminData()` returns (e.g. `{ steps: number; sleep: number; heartRate: number; calories: number }`).

### Hook return shapes

`useGarminData()` resolves to:

```ts
{
  steps: number
  sleep: number
  heartRate: number
  calories: number
  activities: { id: number; type: string; distance: number; duration: number; date: string }[]
}
```

`useRunningStats()` resolves to:

```ts
{
  paceDistribution: { bin: string; upper: number; lower: number }[]
  heartRateZones: { zone: string; count: number }[]
  paceVsHeart: { pace: number; heartRate: number }[]
  temperature: { label: string; count: number }[]
  weatherConditions: { label: string; count: number }[]
  annualMileage: { year: number; totalMiles: number }[]
  byHour: { hour: number; pct: number }[]
  byWeekday: { day: string; pct: number }[]
  distanceBuckets: { label: string; count: number }[]
  treadmillOutdoor: { outdoor: number; treadmill: number }
  paceEnvironment: { pace: number; temperature: number; humidity: number; wind: number; elevation: number }[]
  dailyWeather: { date: string; temperature: number; condition: string; humidity: number; wind: number }[]
}
```

`useSeasonalBaseline()` resolves to:

```ts
{ month: number; min: number; max: number }[]
```


This baseline provides expected min/max values for each month which charts can
use for reference areas.

The mock implementation uses `generateMockRunningStats()` in `src/lib/api.ts` to
create semi-random demo data each time the app loads. You can replace this

function with real API calls for production data.
`useCurrentWeather(lat, lon)` resolves to:
```ts
{ temperature: number; condition: string }
```


`useInsights()` resolves to:

```ts
{
  activeStreak: number
  highHeartRate: boolean
  lowSleep: boolean
  calorieSurplus: boolean
  bestPaceThisMonth: number | null
  mostConsistentDay: string | null
}
```

## Data sources
All mock data lives in `src/lib/api.ts`. The hooks in `src/hooks` wrap these
helpers so components can consume the values asynchronously:

- `getGarminData()` and `getDailySteps()` drive the dashboard metrics and daily
  step charts.
- `getSeasonalBaselines()` provides monthly ranges used for goal overlays.
- `getRunningStats()` supplies the detailed stats used by various analysis components.
- `getWeeklyVolume()` feeds the weekly mileage chart.
- `getBenchmarkStats()` returns peer comparison bands for pace and load.
- `getRunningSessions()` and `getRouteSessions()` generate data for similarity
  maps and route profiles.
- `getStateVisits()` lists state and city totals for the geographic explorer.
- `getActivitySnapshots()` returns hourly step and heart-rate samples used for
  reading focus detection.

The reading focus heatmap displays one of three labels—"Deep Dive," "Skim," or
"Page Turn Panic"—based on intensity calculated from these snapshots. It
appears on the Map playground tab below the geographic explorer.

Replace these stubs with real API calls when connecting to live Garmin data.

## Charts & maps
All charts should be wrapped in Shadcn’s `<ChartContainer>` so they inherit CSS variables for colours and spacing. Include a <ChartHeader> for titles so typography stays consistent.

Map components (Leaflet, Deck.GL) live under `src/components/map/...` and can reference shared styling from `ui/...`.

`useRunningSessions()` returns t-SNE coordinates for recent runs and is visualised with the `SessionSimilarityMap` scatter chart. A `good` flag marks sessions where pace beat the expected baseline.

```ts
{ x: number; y: number; cluster: number; good: boolean }[]
```

`useTrainingConsistency()` powers the `TrainingEntropyHeatmap` chart showing start-time
frequency and a weekly entropy trendline.

### Analytics fun page
`src/pages/Examples.tsx` shows sample charts. It now renders an interactive area chart with a time-range select next to the bar chart demos.

## Charts & Apps Overview

### Dashboard
- **Activities Chart** – compare distance and duration for recent activities.
- **Steps Chart** – daily step totals with change from the previous day and remaining gap to the goal.
- **Daily Steps Chart** – quick view of daily step counts for the selected range.
- **Steps Trend with Goal** – running step trend line against a configurable goal.
- **Weekly Volume Chart** – weekly running mileage totals.
- **ACWR Gauge** – acute‑to‑chronic workload ratio indicator.
- **Bed‑to‑Run Gauge** – hours of training per hour spent in bed.
- **Top Insights** – highlights streaks, best pace and other key summaries.
- **Time in Bed Chart** – nightly time in bed versus target.
- **Reading Probability Timeline** – likelihood of reading throughout the day.
- **Commute Rank** – ranking of commute times against peers.
- **Reading Focus Heatmap** – intensity of reading focus by time.
- **Books vs Calories** – correlation between reading time and calories burned.
- **Reading Stack Split** – breakdown of reading categories.
- **Run Soundtrack Card** – Spotify powered soundtrack for the next run.
- **Compact Next Game Card** – quick view of the upcoming game.
- **Movement Fingerprint** – fingerprint‑style visualization of route patterns.
- **Fragility Gauge** – injury risk based on training variability.
- **Training Entropy Heatmap** – consistency of training start times.
- **Route Similarity** – scatter view comparing route likeness via pairwise Jaccard comparison.
- **Route Novelty Map** – map highlighting novel versus repeated routes using a historical uniqueness score that blends Jaccard overlap with dynamic time‑warping.

Route Similarity measures overlap by comparing each route's segments against others with a pairwise Jaccard metric. Route Novelty builds on that by scoring how historically unique a path is, combining Jaccard overlap with dynamic time‑warping of the full trajectory.

### Statistics
- **Annual Mileage** – yearly mileage totals.
- **Activity by Time** – activity counts across hours of the day.
- **Avg Daily Mileage Radar** – average mileage by weekday.
- **Run Distances** – distribution of run distance buckets.
- **Treadmill vs Outdoor** – ratio of treadmill to outdoor sessions.
- **Pace Distribution** – histogram of running pace.
- **Heart Rate Zones** – time spent in each heart‑rate zone.
- **Pace vs HR** – correlation between pace and heart rate.
- **Training Load Ratio** – balance of recent versus chronic load.
- **Equipment Usage Timeline** – gear mileage accumulation over time.
- **Habit Consistency Heatmap** – frequency of workouts across the calendar.
- **Session Start Entropy** – variability of session start times.
- **Run/Bike Volume Comparison** – weekly running versus cycling volume.
- **Weekly Comparison Chart** – side‑by‑side comparison of weekly metrics.
- **Perf vs Environment Matrix** – performance versus temperature, humidity, wind and elevation.
- **Session Similarity Map** – t‑SNE map of session similarity clusters.
- **Weather Condition Bar** – runs grouped by weather conditions.
- **Pace vs Temperature** – pace plotted against ambient temperature.
- **Route Comparison** – compare metrics for two selected routes.
- **Route Similarity Index** – numeric similarity score for route pairs.

### Geospatial
- **Geo Activity Explorer** – interactive map of activities by location.
- **Location Efficiency Comparison** – route efficiency comparison across regions.
- **State Visit Summary** – choropleth summary of state visits.
- **State Visit Callout** – detailed callout for the selected state.

### Apps
- **Dashboard** – tabbed hub combining map playground, route tools, statistics and session similarity.
- **Statistics Page** – dedicated view for deep‑dive running metrics.
- **Mileage Globe** – 3D globe app visualising annual mileage paths.
- **Analytics Fun Page** – sandbox showcasing interactive chart demos.

## Theming extensions
If you need new variants—like a "danger" button or a "success" badge—run `pnpm dlx shadcn-ui@latest add button` to scaffold the base component. Then copy or edit `src/components/ui/button.tsx` and register your variant in `tailwind.config.js` under `theme.extend`. See <https://ui.shadcn.com/docs/components> for more details.

## Documentation & testing
Storybook (or even MDX) is great for cataloguing all `ui/` components with knobs for variant/size.

Unit tests (Vitest + Testing Library) should live alongside components in a `__tests__` subfolder, e.g. `src/components/ui/button/__tests__/Button.test.tsx`.


## Development

```bash
npm run dev
npm run build
npm test
```

## Spotify integration
The Run Soundtrack card uses the Spotify Web API. Set the following environment variables so the helpers can obtain an access token:

```
VITE_SPOTIFY_CLIENT_ID=<your client id>
VITE_SPOTIFY_CLIENT_SECRET=<your client secret>
VITE_SPOTIFY_REFRESH_TOKEN=<refresh token>
```

Alternatively provide `VITE_SPOTIFY_ACCESS_TOKEN` directly if you already have one. These values are read at runtime by `src/lib/spotify.ts`.

## Weather overlay
The geographic explorer can display precipitation tiles from OpenWeatherMap. A
default API key is included for development. To use your own key instead, set:

```
VITE_WEATHER_KEY=<your OpenWeatherMap API key>
```

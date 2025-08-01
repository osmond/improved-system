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
- `getRunningStats()` supplies the detailed stats on the Statistics page.
- `getWeeklyVolume()` feeds the weekly mileage chart.
- `getBenchmarkStats()` returns peer comparison bands for pace and load.
- `getRunningSessions()` and `getRouteSessions()` generate data for similarity
  maps and route profiles.
- `getStateVisits()` lists state and city totals for the geographic explorer.

Replace these stubs with real API calls when connecting to live Garmin data.

## Charts & maps
All charts should be wrapped in Shadcn’s `<ChartContainer>` so they inherit CSS variables for colours and spacing. Include a <ChartHeader> for titles so typography stays consistent.

Map components (Leaflet, Deck.GL) live under `src/components/map/...` and can reference shared styling from `ui/...`.

`useRunningSessions()` returns t-SNE coordinates for recent runs and is visualised with the `SessionSimilarityMap` scatter chart.

```ts
{ x: number; y: number; cluster: number }[]
```

### Examples page
`src/pages/Examples.tsx` shows sample charts. It now renders an interactive area chart with a time-range select next to the bar chart demos.

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
SPOTIFY_CLIENT_ID=<your client id>
SPOTIFY_CLIENT_SECRET=<your client secret>
SPOTIFY_REFRESH_TOKEN=<refresh token>
```

Alternatively provide `SPOTIFY_ACCESS_TOKEN` directly if you already have one. These values are read at runtime by `src/lib/spotify.ts`.

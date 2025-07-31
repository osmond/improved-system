# Garmin Dashboard

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
If you need new variants—say a “danger” button or a “success” badge—run:

 manually copy/edit the template in `src/components/ui/button.tsx` and register the variant in your Tailwind `theme.extend`.
https://ui.shadcn.com/docs/components

## Documentation & testing
Storybook (or even MDX) is great for cataloguing all `ui/` components with knobs for variant/size.

Unit tests (Vitest + Testing Library) should live alongside components in a `__tests__` subfolder, e.g. `src/components/ui/button/__tests__/Button.test.tsx`.


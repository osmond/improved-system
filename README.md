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

## Charts & maps
All charts should be wrapped in Shadcn’s `<ChartContainer>` so they inherit CSS variables for colours and spacing.

Map components (Leaflet, Deck.GL) live under `src/components/map/...` and can reference shared styling from `ui/...`.

## Theming extensions
If you need new variants—say a “danger” button or a “success” badge—run:

```bash
npx shadcn@latest add button --variant danger
```

or manually copy/edit the template in `src/components/ui/button.tsx` and register the variant in your Tailwind `theme.extend`.

## Documentation & testing
Storybook (or even MDX) is great for cataloguing all `ui/` components with knobs for variant/size.

Unit tests (Vitest + Testing Library) should live alongside components in a `__tests__` subfolder, e.g. `src/components/ui/button/__tests__/Button.test.tsx`.


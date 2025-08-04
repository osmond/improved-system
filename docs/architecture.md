# Architecture

## Framework and Build Tools
- **React 18 + TypeScript** for the application framework.
- **Vite** handles development server and production builds.
- **Tailwind CSS** supplies utility-first styling driven by design tokens in `src/styles/globals.css`.
- **Vitest** with Testing Library provides unit testing support.

## Folder Structure and Naming Conventions
```
/                    # repository root
├─ docs/             # project documentation
├─ public/           # static assets served as-is
├─ src/              # application source
│  ├─ components/    # UI pieces (primitives in `ui/`, feature-specific elsewhere)
│  ├─ features/      # grouped feature modules
│  ├─ hooks/         # reusable data and state hooks
│  ├─ lib/           # utilities and helpers
│  ├─ pages/         # route targets
│  ├─ routes/        # route definitions and groups
│  ├─ styles/        # global styles and tokens
│  └─ types/         # shared TypeScript types
```
- React components and pages use **PascalCase** file names (e.g. `Dashboard.tsx`).
- Hooks begin with `use` (e.g. `useGarminData.ts`).
- Tests live beside code in `__tests__` directories.

## Navigation and Routes
- Navigation is powered by **react-router-dom**.
- Route configuration lives in `src/routes`, where `DashboardRouteGroup` objects organize related paths and icons.
- Actual page components reside in `src/pages` and are referenced by the route definitions.

## Design System and Alias Guidelines
- Shared UI primitives live under `src/components/ui` and follow the Shadcn style.
- Styling relies on Tailwind CSS with tokens extended in `tailwind.config.ts` and consumed via CSS variables.
- Import paths use the `@` alias mapped to `src` (configured in `vite.config.ts` and `tsconfig.json`).
- Reuse existing primitives and the `cn()` helper for class merging when building new components.

Keep this document updated as architecture and conventions evolve.

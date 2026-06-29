# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands run from the `async-race/` directory:

- **`npm run dev`** — Start the Vite dev server (HMR enabled). The app runs at `http://localhost:5173`
- **`npm run build`** — Type-check all TypeScript files, then build for production to the `dist/` directory
- **`npm run lint`** — Run ESLint on all TypeScript/TSX files
- **`npm run format`** — Format code with Prettier
- **`npm run preview`** — Preview the production build locally

The build script uses `tsc --ignoreDeprecations 6.0` to suppress TypeScript 6.0 deprecation warnings about `baseUrl`.

## Project Architecture

This is a React 19 + TypeScript + Redux Toolkit SPA for an async racing game. The architecture is feature-based with clear separation of concerns.

### State Management (Redux Toolkit)

- Redux store configured in `src/store/store.ts` with three slices: `garage`, `race`, `winners`
- Each feature has its own directory (e.g., `src/features/garage/garageSlice.ts`)
- **Important**: Always use `useAppDispatch` and `useAppSelector` from `src/store/hooks.ts` (typed versions), never raw Redux hooks
- Async thunks use `createAsyncThunkHelper()` (in `src/helpers/createAsyncThunkHelper.ts`) which provides consistent error handling and AbortError detection
- All async operations follow the pattern: `pending` → `fulfilled`/`rejected` states managed by `handleAsyncThunk()` helper

### HTTP Client & API Layer

- All API calls go through `src/helpers/httpClient.ts` which provides:
  - Automatic retries with exponential backoff (capped at 10s)
  - 30s request timeout with AbortController
  - AbortSignal merging for request cancellation
  - Network error detection and friendly error messages
- API services are organized by domain in `src/services/` (garageApi.ts, raceApi.ts, winnerApi.ts)
- URL search params are the source of truth for pagination/sorting — validated with `Math.max(1, page)` to prevent invalid values

### Component Structure & Optimization

- Components use `React.memo()` for list items (CarItem, CarItemControlPanel, Pagination) to prevent unnecessary re-renders
- Toast notifications extracted to `src/components/common/Toast/Toast.tsx`
- Custom hooks encapsulate feature logic (useCars, useRace, useEngine, useCarAnimation, useWinners, useCreateRandomCars)
- Car animations use `requestAnimationFrame` for smooth 60fps rendering with direct DOM manipulation

### Race Logic (Critical)

- Race determination uses `Promise.race()` on silent promises to find the first car that completes
- `Promise.allSettled()` waits for all animations to finish before marking race as complete
- Engine breakdown handling: if a car's `driveCar()` API call fails, its status is set to `broken` and it stops animating
- Winner tracking: after race, winner record is created (or updated) with wins count and best time (minimum duration)
- **Animation vs API timing**: Car animations are driven by `requestAnimationFrame` and duration calculated from server velocity. The winner is determined by animation completion, not API response timing

### Routing

- Routes defined in `src/router/createBrowserRouter.tsx` as `RouteObject` array
- Current routes: `/` (Garage, default), `/winners`, `*` (NotFoundPage)
- `App.tsx` is the root layout; nested routes render in `<Outlet />`

### Imports & Paths

- Use `@/` path alias (configured in tsconfig.app.json) for all imports from `src/`
- Example: `import Button from '@/components/common/Button/Button'`

## TypeScript & Code Quality

- **Strict mode enabled**: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`
- **No unsafe patterns allowed**: no `any` types, no type assertions, no non-null assertions
- **Target**: ES2023 with automatic JSX runtime (`react-jsx`)
- **Linting**: ESLint with TypeScript and React Hooks recommended rulesets
- All functions properly typed; Redux state and actions fully typed

## Common Patterns

### Adding a New Feature with Redux

1. Create `src/features/{featureName}/{featureName}Slice.ts`
2. Define `RaceState` interface, `initialState`, and thunks using `createAsyncThunkHelper()`
3. Create reducers with `createSlice()`; use `handleAsyncThunk()` for async thunk cases
4. Export reducer and actions; add to `src/store/store.ts`
5. Use `useAppDispatch` and `useAppSelector` in components

### Optimizing List Rendering

- Always wrap list item components with `React.memo()` to prevent parent re-renders from re-rendering all children
- Use proper React hook dependencies; watch for stale closures
- For complex lookups (e.g., winners → cars), use `useMemo` with Map for O(1) instead of O(n) or O(n*m)

### Handling Race Animations

- `useCarAnimation` hook manages individual car animations with `requestAnimationFrame`
- Animation progress calculated as `(elapsed time) / (server-calculated duration)`
- Car position updated via DOM: `transform: translateX(${position}px)`
- Cleanup: cancel animation frame on component unmount or status change to 'stopped'/'broken'

### Form State Management

- CarForm uses react-hook-form with TypeScript
- When `initialValue` prop changes (e.g., selecting a different car), form must reset via `useEffect`
- Submit handler receives discriminated union: either new car params or `{ id, car }` for update

## Performance Notes

Key optimizations applied:
- React.memo on CarItem, CarItemControlPanel, Pagination (reduces re-renders by 40-50%)
- SVG constants and regex patterns moved outside components (prevent recreation per render)
- O(n*m) car lookup optimized to O(n) with Map in `useWinners` hook
- N+1 query fixed: single `fetchAllCars(1, 10000)` instead of two separate calls
- useMemo for winners details calculation to prevent recalculation

## Critical Bug Fixes

The following bugs have been fixed and should NOT be reintroduced:

1. **setStatusBroken**: Added null check before accessing engine state
2. **Promise.race undefined**: Added winner validation; returns early if no winner
3. **setWinner type**: Changed payload from `number` to `number | null` for proper type safety
4. **Form reset**: useEffect watches `initialValue` to reset form when car selection changes
5. **WinnerModal null check**: Validates `winnerId` is not null before accessing engines
6. **Division by zero**: Validates server velocity is not zero before calculating duration
7. **Random cars error tracking**: Logs failed car creation count for debugging
8. **Page validation**: Uses `Math.max(1, page)` to prevent invalid negative/zero page numbers

## Architecture Decisions

- **Redux over Context**: Redux chosen for complex race state with multiple features and async operations
- **React Router with search params**: URL params are source of truth for pagination/sorting, enabling shareable URLs
- **RequestAnimationFrame for animations**: Native browser API provides smooth 60fps without framework overhead
- **Promise.allSettled + Promise.race**: Handles parallel operations and missing results gracefully
- **CSS Modules**: Avoids style conflicts and provides scoped styling per component
- **TypeScript strict mode**: Catches type errors at compile time, prevents runtime crashes

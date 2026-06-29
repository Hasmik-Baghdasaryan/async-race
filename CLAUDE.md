# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

All commands run from the `async-race/` directory:

- **`npm run dev`** — Start the Vite dev server (HMR enabled). The app runs at `http://localhost:5173`
- **`npm run build`** — Type-check all TypeScript files, then build for production to the `dist/` directory
- **`npm run lint`** — Run ESLint on all TypeScript/TSX files
- **`npm run preview`** — Preview the production build locally

## Project Architecture

This is a React 19 + TypeScript + Vite application for an async racing game. The architecture follows these patterns:

### State Management (Redux Toolkit)

- Redux Toolkit is configured in `src/store/store.ts` with separate slices in `src/features/`
- Each feature gets its own directory under `src/features/` (e.g., `src/features/garage/garageSlice.ts`) that exports a reducer
- The main store file imports all reducers and configures them
- Redux hooks are typed and exported from `src/store/hooks.ts` as `useAppDispatch` and `useAppSelector` — always use these typed versions, not raw Redux hooks
- Slices use Redux Toolkit's `createSlice()` to define initial state, reducers, and (optionally) async thunks

### Routing

- Routes are defined in `src/router/createBrowserRouter.tsx` as an array of `RouteObject`s passed to React Router's `createBrowserRouter()`
- Currently routes: `/` (App root), `/garage` (child route), `/winners` (child route)
- The `App.tsx` component serves as the root layout; nested routes render in the children of App

### Imports and Paths

- Use the `@/` path alias to import from `src/` (configured in `tsconfig.app.json` and `vite.config.ts`)
- Example: `import store from '@/store/store'` instead of relative paths

### Code Organization

```
src/
├── features/           # Redux slices by domain (e.g., garage)
│   └── garage/
│       └── garageSlice.ts
├── store/              # Redux store setup and typed hooks
│   ├── store.ts
│   └── hooks.ts
├── router/             # Route definitions
│   └── createBrowserRouter.tsx
├── assets/             # Static assets (images, etc.)
├── App.tsx             # Root layout component
└── main.tsx            # Entry point (renders to #root in index.html)
```

## TypeScript & Type Safety

- TypeScript target is ES2023 with strict settings: `noUnusedLocals`, `noUnusedParameters`, and `noFallthroughCasesInSwitch` are enforced
- JSX is set to `react-jsx` (automatic runtime)
- Before building, run `npm run build` which runs `tsc -b` to type-check the entire project

## ESLint Configuration

- ESLint config uses the modern flat config format (eslint.config.js)
- Enabled rulesets: ESLint recommended, TypeScript ESLint recommended, React Hooks recommended, React Refresh (for Vite)
- Global ignore: `dist/` directory
- No custom rules beyond defaults; if stricter linting is needed, the README suggests enabling type-aware rules

## Common Patterns

### Adding a New Feature with Redux

1. Create `src/features/{featureName}/{featureName}Slice.ts`
2. Define initial state and reducers in `createSlice()`
3. Export the reducer as default
4. Import and add to `src/store/store.ts` in the `reducer` config
5. Use `useAppDispatch()` and `useAppSelector()` from hooks in components

### Adding a New Route

1. Add an object to the route array in `src/router/createBrowserRouter.tsx`
2. Use `path`, `element`, and optionally `children` for nested routes

# Async Race 🏎️

A single-page application for managing a car garage and running async races. Built as part of the Rolling Scopes School Stage 2 curriculum.

## 🚀 Live Demo

> _Coming soon_

---

## 🛠️ Tech Stack

- **React 19** — UI library
- **TypeScript** — type safety throughout
- **Redux Toolkit** — global state management (race state, garage, winners)
- **React Router** — client-side routing with URL search params as source of truth
- **Vite** — build tool
- **CSS Modules** — scoped component styles

---

## ✨ Features

### Garage

- Create, update, and delete cars with custom name and color
- Generate 100 random cars in one click
- Paginated car list (7 cars per page)
- Start/stop individual car engines with smooth animation

### Race

- Start a race for all cars on the current page simultaneously
- Parallel API calls using `Promise.allSettled` and `Promise.race`
- Cars animate using `requestAnimationFrame` based on server-calculated velocity
- Engine breakdown handling — broken cars stop in place, race continues
- Winner detection and announcement modal
- Reset race returns all cars to starting position
- Button states managed throughout race lifecycle

### Winners

- Persistent winners table with car image, name, wins count, and best time
- Pagination (10 winners per page)
- Sortable by wins and best time (ascending/descending)
- Winner record created or updated after each race

---

## 📦 Getting Started

### Prerequisites

- Node.js 19+
- The [async-race-api](https://github.com/mikhama/async-race-api) mock server running locally

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/async-race.git
cd async-race

# Install dependencies
npm install

# Start the mock API server (in a separate terminal)
git clone https://github.com/mikhama/async-race-api.git
cd async-race-api
npm install
npm start

# Start the app
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 📁 Project Structure

```
src/
├── assets/            # Static assets
├── components/
│   ├── common/        # Shared UI components (Pagination, Button, etc.)
│   └── layout/        # Layout components (Header, etc.)
├── constants/         # App-wide constants
├── features/
│   ├── garage/        # Car management, CRUD, animation
│   ├── race/          # Race logic, engine control, winner
│   └── winners/       # Winners table, sorting, pagination
├── helpers/           # Shared utilities (httpClient, error handling)
├── pages/             # Page components (Garage, Winners)
├── router/            # Route configuration
├── services/          # API layer (garage, race, winners)
└── store/             # Redux store configuration
```

---

## 📝 Implementation Notes

- URL search params are used as the source of truth for pagination, sorting, and filtering — state persists across navigation
- `requestAnimationFrame` loop drives car animations with direct DOM manipulation to avoid React re-renders at 60fps
- Race orchestration uses `Promise.allSettled` for parallel engine starts and `Promise.race` with silent rejection handling for winner detection
- Each car's animation pipeline is independent — engine breakdown on one car does not affect others

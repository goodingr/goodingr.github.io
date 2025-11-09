# Portfolio App

## Analytics setup

1. Duplicate `.env.example` as `.env` in this folder.
2. Replace `G-XXXXXXXXXX` with the Google Analytics 4 measurement ID you want to use for the entire portfolio.
3. Restart any running `npm run dev`/`npm run build` commands so Vite reloads the environment variable.

The app sends a page view event for every route change via the shared `@portfolio/analytics` helper. If you later add authentication and want to understand who is browsing, call `setAnalyticsUser('<user-id>')` from the helper once you know the visitor's identity; GA4 will start associating events with that user id.

## Featured projects

- **Conway's Game of Life** – editable grid with start/pause, single-step, random seeds, and adjustable tick speed to showcase emergent patterns.
- **Scientific Calculator** – fully featured calculator widget shared with the dedicated calculator app.

### Game of Life presets

- **Glider** – smallest spaceship that drifts diagonally forever.
- **Lightweight spaceship** – faster pattern that translates horizontally.
- **Pulsar** – large period-3 oscillator that cycles endlessly.
- **Gosper glider gun** – emits a steady stream of gliders demonstrating unbounded growth.

Every preset loads centered on the canvas, and the rules panel in-app summarises Conway's classic evolution rules for quick reference.

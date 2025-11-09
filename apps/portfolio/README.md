# Portfolio App

## Analytics setup

1. Duplicate `.env.example` as `.env` in this folder.
2. Replace `G-XXXXXXXXXX` with the Google Analytics 4 measurement ID you want to use for the entire portfolio.
3. Restart any running `npm run dev`/`npm run build` commands so Vite reloads the environment variable.

The app sends a page view event for every route change via the shared `@portfolio/analytics` helper. If you later add authentication and want to understand who is browsing, call `setAnalyticsUser('<user-id>')` from the helper once you know the visitor's identity; GA4 will start associating events with that user id.


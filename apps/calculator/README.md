# Calculator App

## Analytics setup

1. Copy `.env.example` to `.env`.
2. Fill in `VITE_ANALYTICS_ID` with your GA4 measurement ID (ideally the same one used by the portfolio app so all traffic lands in one property).
3. Restart `npm run dev:calculator` (or rebuild for production) so Vite exposes the env var.

Analytics bootstraps through the shared `@portfolio/analytics` helper, which automatically sends a page view when the app loads. To attribute visits to signed-in users, call `setAnalyticsUser('<user-id>')` after your auth flow completes.


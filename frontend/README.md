# frontend

React SPA built with [Vite](https://vitejs.dev/).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm test` | Run tests (vitest) |

## Env vars

For local development see `.env.example`. Prefix must be `VITE_` (Vite convention).

In the Docker image the SPA is served by `server.js`, which proxies `/api/*` to the backend. Point that proxy at the backend at pod start:

- `BACKEND_URL` — backend base URL the frontend server proxies `/api/*` to (default `http://backend:7007`). Set at runtime, no rebuild needed.

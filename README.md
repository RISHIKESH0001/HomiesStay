# Homies Stay

Homies Stay is a React single-page application for discovering and managing hostel stays.

## Local development

```bash
npm install
npm run dev
```

For full-stack development, start the Spring Boot API from `backend` in a separate terminal with `.\mvnw.cmd spring-boot:run`. The Vite development server forwards `/api` requests to `http://localhost:8080`, so the browser uses the API's HTTP-only session cookie and CSRF protection without a cross-origin setup.

## Production build

Run the checks locally before deploying:

```bash
npm run lint
npm run build
```

The deployable static files are generated in `dist`. To test that output locally:

```bash
npm run preview
```

## Free public demo with Cloudflare Tunnel

The frontend can be hosted on Vercel while the Spring Boot API and MySQL database remain on the laptop. For cross-origin sessions, set the frontend and backend environment variables before starting the tunnel:

```powershell
# Frontend: in Vercel project settings
VITE_API_BASE_URL=https://api.example.trycloudflare.com/api/v1

# Backend: in backend/.env
CORS_ALLOWED_ORIGINS=https://your-project.vercel.app
SESSION_COOKIE_SECURE=true
SESSION_COOKIE_SAME_SITE=None
SESSION_COOKIE_NAME=SESSION
APP_BASE_URL=https://your-project.vercel.app
```

Start MySQL and the API, then expose the API on HTTPS:

```powershell
cd backend
.\mvnw.cmd spring-boot:run

# In another terminal
cloudflared tunnel --url http://localhost:8080
```

Set `VITE_API_BASE_URL` in Vercel to the Cloudflare URL plus `/api/v1`. For a temporary Cloudflare hostname, redeploy the frontend whenever the tunnel hostname changes. Keep MySQL and the laptop running; closing either service ends the public demo.

## Deployment

Configure the hosting provider with:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: use a current LTS release

This app uses `BrowserRouter`. The included `public/_redirects` and `vercel.json` files keep client-side routes working when a user refreshes a nested URL on Netlify or Vercel.

Production hosting must also route `/api` to the Spring Boot service on the same site (or configure a strict credentialed CORS allowlist), terminate HTTPS, and set `SESSION_COOKIE_SECURE=true` for the API. Before accepting real users, configure production secrets and SMTP, verify automated MySQL backups/restoration, and complete the remaining launch checklist in `backend/README.md`.

# Homies Stay

Homies Stay is a React single-page application for discovering and managing hostel stays.

## Local development

```bash
npm install
npm run dev
```

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

## Deployment

Configure the hosting provider with:

- Build command: `npm run build`
- Publish directory: `dist`
- Node.js: use a current LTS release

This app uses `BrowserRouter`. The included `public/_redirects` and `vercel.json` files keep client-side routes working when a user refreshes a nested URL on Netlify or Vercel.

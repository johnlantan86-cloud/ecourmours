# Kigali Great Market

Full-stack marketplace app built with Vue, Vite, and Express.

## Local Development

Install dependencies:

```bash
npm install
```

Run the frontend and backend together:

```bash
npm run dev
```

Local app:

```text
http://127.0.0.1:5174
```

## Production Build

Build the frontend:

```bash
npm run build
```

Start the Express server:

```bash
npm start
```

In production, Express serves both:

- API routes under `/api`
- The built frontend from `dist`

## Deployment

Deploy this as a Node web service, not as a static-only Vite site.

Use these settings on Render, Railway, Fly.io, or similar Node hosts:

```text
Build command: npm install && npm run build
Start command: npm start
Node version: 22.12.0 or newer
```

Required environment variables:

```text
JWT_SECRET=use-a-long-random-secret
ADMIN_EMAIL=admin@kigali.com
ADMIN_PASSWORD=choose-a-secure-password
```

Usually leave this empty when the frontend and backend are deployed together:

```text
VITE_API_URL=
```

If the frontend and backend are deployed separately, set `VITE_API_URL` while building the frontend:

```text
VITE_API_URL=https://your-backend-domain.com/api
```

Then set the backend CORS origin:

```text
CORS_ORIGIN=https://your-frontend-domain.com
```

## Important Storage Note

The app currently stores users and products in `server/data/db.json`. Some deployment platforms erase local files on redeploy or restart. For real production use, add persistent disk storage or connect a database.

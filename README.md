# ISS Telemetry Log — Frontend Club Task

A live ISS tracking dashboard built with Next.js 14, Axios, and CSS Modules (inline styles).

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev

# 3. Open in browser
http://localhost:3000
```

That's it. The app will redirect you to `/login` automatically.

---

## Project Structure

```
iss-tracker/
├── middleware.ts                  ← Route protection (checks auth cookie)
├── app/
│   ├── layout.tsx                 ← Root Server Component (fonts, metadata)
│   ├── globals.css                ← Design tokens, global styles
│   ├── page.tsx                   ← Redirects / → /login
│   ├── login/
│   │   ├── page.tsx               ← Login layout (Server Component)
│   │   └── LoginForm.tsx          ← Form logic, cookie auth (Client Component)
│   └── dashboard/
│       ├── page.tsx               ← Dashboard layout (Server Component)
│       └── TelemetryDashboard.tsx ← Polling, state, table, pagination (Client)
```

## How It Works

### Authentication
- `/login` — Enter any username/password. A mock JWT is stored in a browser cookie (`iss_auth_token`).
- `middleware.ts` — Checks for the cookie on every request to `/dashboard`. No cookie = redirect to `/login`.
- Logout clears the interval timer AND the cookie, then redirects to `/login`.

### Telemetry
- On mount, `TelemetryDashboard` fetches `https://api.wheretheiss.at/v1/satellites/25544` immediately, then every 10 seconds via `setInterval`.
- Each fetch **appends** to the log array (newest first) — so you build a running history.
- The cleanup function in `useEffect` clears the interval to prevent memory leaks.

### Pagination
- 10 records per page, client-side.
- Previous / Next buttons navigate the history log.

## Notes
- No backend needed — this is a pure frontend task.
- The ISS API is free and public; no API key required.
- The "mock JWT" is just a base64-encoded JSON object. In a real app you'd verify this server-side.
"# CC_Front_end_Task-1" 
"# CC_Front_end_Task-1" 

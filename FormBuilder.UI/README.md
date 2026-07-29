# Form Builder — Frontend

React + Vite frontend for the Form Builder application. Dynamic form designer with drag-and-drop, submissions collection, and analytics.

## Tech Stack

- **React 18** + **Vite 5** — UI framework + build tool
- **Tailwind CSS** — Styling (shadcn/ui component patterns)
- **React Router v6** — Routing with protected routes
- **Zustand** — Global state (auth, session)
- **TanStack Query** — Server state, caching, mutations
- **axios** — HTTP client with JWT interceptor
- **react-hook-form** + **zod** — Type-safe form validation
- **@dnd-kit** — Drag-and-drop (form builder canvas — coming next)
- **MSW** — Mock Service Worker (backend API mocked until real API is built)
- **lucide-react** — Icons
- **react-hot-toast** — Toast notifications

## Getting Started

```bash
npm install
npm run dev
```

Opens **http://localhost:5174**.

## Demo Credentials

Mock login works out of the box:

- **Email:** `demo@formbuilder.dev`
- **Password:** `Demo1234`

Or register a new account — it will be saved in memory for the session.

## Architecture

Feature-based folder structure. Each feature owns its own components, hooks, API calls, store, and pages:

```
src/
├── app/               ← App-level composition (router, providers)
├── config/            ← Env vars, axios instance
├── shared/            ← Reusable across all features
│   ├── components/
│   │   ├── ui/        ← Button, Input, Label, Card (shadcn-style)
│   │   └── layout/    ← AuthLayout, DashboardLayout
│   └── lib/           ← cn(), formatters, utils
├── features/
│   ├── auth/          ← Login, Register, session management
│   │   ├── api/       ← authApi.js
│   │   ├── components/ ← LoginForm, RegisterForm, ProtectedRoute
│   │   ├── hooks/     ← useLogin, useRegister, useLogout
│   │   ├── pages/     ← LoginPage, RegisterPage
│   │   ├── schemas/   ← zod validation schemas
│   │   └── store/     ← Zustand auth store
│   ├── dashboard/     ← Dashboard home
│   ├── forms/         ← Form builder (coming next)
│   └── submissions/   ← Response viewer (coming next)
├── mocks/             ← MSW handlers (mock backend)
├── App.jsx
├── main.jsx
└── index.css
```

### Design Principles

- **Dependencies point inward** — `features/` may use `shared/` but not vice-versa
- **Path aliases** — `@app`, `@features`, `@shared`, `@config` (see `vite.config.js`)
- **Type-safe forms** — zod schemas ensure runtime + design-time validation
- **JWT flow** — token stored in localStorage, axios interceptor attaches to every request, auto-redirect on 401

## Backend API Contract

The backend (built next) must implement these endpoints:

| Endpoint | Method | Payload | Response |
|----------|--------|---------|----------|
| `/auth/login` | POST | `{ email, password }` | `{ token, user }` |
| `/auth/register` | POST | `{ fullName, email, password }` | `{ token, user }` |
| `/auth/me` | GET | (Bearer token) | `user` |
| `/auth/logout` | POST | (Bearer token) | `{ ok: true }` |
| `/forms` | GET | (Bearer token) | `Form[]` |
| `/forms` | POST | `Form` | `Form` |
| `/forms/:id` | GET/PUT/DELETE | — | `Form` |
| `/forms/:id/submissions` | GET/POST | `Submission` | `Submission[]` / `Submission` |

## Switching to Real Backend

1. Edit `.env.development`:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_USE_MOCK_API=false
   ```
2. Restart `npm run dev`.
3. MSW no longer intercepts — requests go to your real backend.

## Scripts

```bash
npm run dev       # Start dev server (http://localhost:5174)
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

## Roadmap

- [x] Login / Register with mocked API
- [x] Protected routes, session persistence
- [x] Dashboard shell
- [ ] Form builder canvas (drag-and-drop with dnd-kit)
- [ ] Field types: text, textarea, dropdown, checkbox, radio, date, file
- [ ] Publish form → shareable public URL
- [ ] Submission viewer + CSV export
- [ ] Analytics dashboard
- [ ] Real backend integration (ASP.NET Core Web API + MongoDB)

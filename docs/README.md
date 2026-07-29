# Form Builder — Documentation

Full technical and functional documentation for the Form Builder application: how the app works, how the frontend and backend are built, what every API endpoint does, and how the data is stored.

---

## 📚 Files in this folder

### Product & workflow

| File | What's in it |
|------|--------------|
| **[01_WORKFLOW.md](./01_WORKFLOW.md)** | Step-by-step user journey with API calls at each step. **Start here** if you're new to the project. |
| **[05_UI_TO_API_MAP.md](./05_UI_TO_API_MAP.md)** | Cheat sheet: which endpoint is called when the user clicks button X. |

### API specification

| File | What's in it |
|------|--------------|
| **[02_API_REFERENCE.md](./02_API_REFERENCE.md)** | Every endpoint with request/response examples, HTTP method, auth requirements. |
| **[03_DATA_MODELS.md](./03_DATA_MODELS.md)** | MongoDB collections, their fields, indexes, relationships. |
| **[04_AUTH_FLOW.md](./04_AUTH_FLOW.md)** | JWT authentication explained — how login works, what happens on each request. |

### Technical implementation (how the code is built)

| File | What's in it |
|------|--------------|
| **[06_UI_ARCHITECTURE.md](./06_UI_ARCHITECTURE.md)** | React frontend — folder structure, state management (Zustand + React Query), routing, API integration, theming, form handling, modals, adding a new feature. |
| **[07_API_ARCHITECTURE.md](./07_API_ARCHITECTURE.md)** | ASP.NET Core backend — N-Tier layers, dependency flow, JWT setup, MongoDB integration, logging, testing, adding a new endpoint. |

### End-user & operational reference

| File | What's in it |
|------|--------------|
| **[08_USER_MANUAL.md](./08_USER_MANUAL.md)** | End-user guide — walks a brand-new user through the app end to end. No technical background required. Sign up → build a form → share → view responses → account settings. Plus troubleshooting and FAQ. |
| **[09_API_PAYLOADS.md](./09_API_PAYLOADS.md)** | Sample request/response payloads for every endpoint (24 endpoints + health check). Includes error responses and copy-pasteable cURL commands. Ends with a full end-to-end cURL script. |

---

## 🎯 Reading paths by role

### "I'm a new user — how do I use this app?"
1. [08_USER_MANUAL.md](./08_USER_MANUAL.md) — click-by-click walkthrough for end users

### "I just want to understand the app from a dev perspective"
1. [01_WORKFLOW.md](./01_WORKFLOW.md) — the user journey (with API calls)
2. [05_UI_TO_API_MAP.md](./05_UI_TO_API_MAP.md) — cheat sheet

### "I need to call the API from Postman / cURL"
1. [09_API_PAYLOADS.md](./09_API_PAYLOADS.md) — sample payloads for every endpoint
2. [02_API_REFERENCE.md](./02_API_REFERENCE.md) — endpoint catalog with validation rules

### "I'm going to work on the frontend"
1. [06_UI_ARCHITECTURE.md](./06_UI_ARCHITECTURE.md) — how the React code is organized
2. [02_API_REFERENCE.md](./02_API_REFERENCE.md) — endpoints you can call
3. [05_UI_TO_API_MAP.md](./05_UI_TO_API_MAP.md) — click → endpoint mapping

### "I'm going to work on the backend"
1. [07_API_ARCHITECTURE.md](./07_API_ARCHITECTURE.md) — how the C# code is organized
2. [03_DATA_MODELS.md](./03_DATA_MODELS.md) — the database
3. [02_API_REFERENCE.md](./02_API_REFERENCE.md) — endpoints as-designed
4. [04_AUTH_FLOW.md](./04_AUTH_FLOW.md) — JWT deep-dive

### "I need to add a new endpoint end-to-end"
1. [07_API_ARCHITECTURE.md — Adding a New Endpoint](./07_API_ARCHITECTURE.md#adding-a-new-endpoint)
2. [06_UI_ARCHITECTURE.md — Adding a New Feature](./06_UI_ARCHITECTURE.md#adding-a-new-feature)

### "I want to deploy this"
1. [07_API_ARCHITECTURE.md — Deployment Considerations](./07_API_ARCHITECTURE.md#deployment-considerations)

---

## 🏗️ System Architecture (30-second overview)

```
┌─────────────────────────────────────────────────────────┐
│                   BROWSER (React SPA)                    │
│  FormBuilder.UI  —  Vite + React 18 + Tailwind          │
│  • Zustand (auth + UI state)                             │
│  • TanStack Query (server state)                         │
│  • axios (with unwrap() + JWT interceptor)               │
└────────────────────────┬─────────────────────────────────┘
                         │  HTTPS + JSON
                         │  Authorization: Bearer <JWT>
                         ▼
┌─────────────────────────────────────────────────────────┐
│         BACKEND API (ASP.NET Core 9 Web API)             │
│  FormBuilder.API      → HTTP layer (Controllers)        │
│  FormBuilder.Service  → Business logic                  │
│  FormBuilder.Data     → MongoDB repositories            │
│  FormBuilder.Core     → Shared contracts (DTOs, Models) │
│  FormBuilder.Utilities → Logger, hasher, extensions     │
│  FormBuilder.Message  → ApiResponse envelope            │
└────────────────────────┬─────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                   MongoDB Atlas                          │
│  Collections: users / folders / forms / submissions      │
└─────────────────────────────────────────────────────────┘
```

## 🔑 Key Design Decisions

| Decision | Why |
|----------|-----|
| **N-Tier Architecture** (not Clean Arch + CQRS) | The app is CRUD-heavy. N-Tier is simpler, faster to build, matches typical enterprise .NET code. Clean Arch + CQRS would be overkill for this domain. |
| **MongoDB (not SQL Server)** | Blocks and submissions have flexible schemas — NoSQL fits naturally. Also removes the SQL Server dev dependency. |
| **JWT (not cookies)** | Simpler for a portfolio project. Stateless — API can scale horizontally. Frontend stores in `localStorage`. |
| **ApiResponse<T> envelope on every response** | Predictable contract for the frontend. `unwrap()` on the client handles both success and error paths uniformly. |
| **TanStack Query for server state** (not Zustand or Redux) | Automatic caching, refetching, invalidation, loading/error states. Zustand is reserved for auth + UI state only. |
| **CSS variables for theming** | One `data-theme` attribute on `<html>` swaps colors app-wide without re-rendering components. |
| **BCrypt for password hashing** | Industry standard. Slow by design (work factor 12) — resistant to offline brute-force. |

## 🌐 Base URLs

| Environment | Frontend | API |
|-------------|----------|-----|
| Development | http://localhost:5180 (varies) | http://localhost:5000 |
| Production | *(not deployed yet)* | *(not deployed yet)* |

## 🔧 Quick Start

```powershell
# Backend (in one terminal)
cd D:\Julfikar\Projects\FormBuilder
dotnet run --project FormBuilder.API
# → http://localhost:5000/swagger

# Frontend (in another terminal)
cd D:\Julfikar\Projects\FormBuilder\FormBuilder.UI
npm install
npm run dev
# → http://localhost:5180
```

Or open the folder in VS Code and press **F5** — see `.vscode/launch.json`.

## 📝 Content-Type & Auth Conventions

- All requests/responses: `Content-Type: application/json`
- Protected endpoints: `Authorization: Bearer <JWT>`
- IDs are MongoDB ObjectIds (24-char hex)
- Timestamps are ISO 8601 UTC (`"2026-07-10T12:34:56Z"`)

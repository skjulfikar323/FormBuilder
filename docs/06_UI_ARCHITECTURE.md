# UI Technical Documentation — FormBuilder.UI

Complete architecture of the React frontend. This is a build reference (how the code is organized and why), not a user guide.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Folder Structure](#folder-structure)
4. [Application Bootstrap](#application-bootstrap)
5. [Routing](#routing)
6. [State Management](#state-management)
7. [API Integration](#api-integration)
8. [Authentication Flow](#authentication-flow)
9. [Theme System](#theme-system)
10. [Form Handling](#form-handling)
11. [Modal System](#modal-system)
12. [Toast Notifications](#toast-notifications)
13. [Form Builder Data Model](#form-builder-data-model)
14. [Environment Configuration](#environment-configuration)
15. [Development & Build](#development--build)
16. [Adding a New Feature](#adding-a-new-feature)

---

## Overview

**FormBuilder.UI** is a single-page React application built with Vite. It talks to the ASP.NET Core backend over REST + JWT and provides:

- Marketing landing page
- Auth (login, register)
- Dashboard with folders + forms
- Form builder (Flow / Theme / Response tabs)
- Public form-fill chat interface at `/f/:formId`
- Settings

It follows a **feature-based folder structure** — each feature is a self-contained folder under `src/features/`.

---

## Tech Stack

| Concern | Library | Version |
|---------|---------|---------|
| Runtime | **React** | 18 |
| Build | **Vite** | 5 |
| Language | JavaScript (ES2022) | — |
| Styling | **Tailwind CSS** + CSS variables | 3.4 |
| Routing | **React Router** | 6 |
| Server state | **TanStack Query (React Query)** | 5 |
| Client state | **Zustand** (with `persist` middleware) | 5 |
| HTTP client | **axios** | 1.7 |
| Form handling | **react-hook-form** + **zod** + `@hookform/resolvers` | latest |
| Icons | **lucide-react** | 0.469 |
| Toasts | **react-hot-toast** | 2 |
| Class merging | `clsx` + `tailwind-merge` | latest |
| Mock API (offline dev) | **MSW** (currently disabled) | 2 |

Full list: `package.json`.

---

## Folder Structure

```
FormBuilder.UI/
├── public/
│   ├── favicon.svg
│   ├── mockServiceWorker.js         (MSW — currently disabled)
│   └── Julfikar_Sk_Resume.pdf
│
├── src/
│   ├── main.jsx                     Entry — bootstraps React + optional MSW
│   ├── App.jsx                      Root — wraps in AppProviders + AppRouter
│   ├── index.css                    Tailwind base + CSS variables per theme
│   │
│   ├── app/
│   │   ├── providers.jsx            BrowserRouter + QueryClient + Toaster + ThemeApplier
│   │   └── router.jsx               Route table (public + protected)
│   │
│   ├── config/
│   │   ├── env.js                   Reads Vite env vars
│   │   └── api.js                   axios instance + unwrap() + errorMessage()
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── AuthLayout.jsx       (login/register decoration)
│   │   │   │   └── DashboardLayout.jsx  (workspace header + <Outlet/>)
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Label.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── FormField.jsx
│   │   │       ├── Modal.jsx            (base modal — portal, backdrop, ESC-to-close)
│   │   │       ├── PromptModal.jsx      (input + Save button)
│   │   │       └── ConfirmModal.jsx     (danger/warning/info tones)
│   │   └── lib/
│   │       └── utils.js             (cn() helper — clsx + tailwind-merge)
│   │
│   ├── features/
│   │   ├── landing/                 Marketing homepage
│   │   │   ├── pages/LandingPage.jsx
│   │   │   └── components/          (Hero, Navbar, ProductPreview, FeatureGrid, ...)
│   │   │
│   │   ├── auth/                    Login / register / password
│   │   │   ├── api/authApi.js
│   │   │   ├── hooks/useAuth.js     (useLogin, useRegister, useLogout)
│   │   │   ├── schemas/authSchemas.js (Zod schemas)
│   │   │   ├── store/authStore.js   (Zustand — token + user)
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── PasswordInput.jsx (reusable input with eye toggle)
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── pages/
│   │   │       ├── LoginPage.jsx
│   │   │       └── RegisterPage.jsx
│   │   │
│   │   ├── dashboard/               Workspace (folders + form cards)
│   │   │   ├── api/
│   │   │   │   ├── foldersApi.js
│   │   │   │   └── formsApi.js
│   │   │   ├── hooks/
│   │   │   │   ├── useFolders.js
│   │   │   │   └── useForms.js
│   │   │   ├── store/workspaceStore.js  (only activeFolderId — UI state)
│   │   │   ├── components/
│   │   │   │   ├── WorkspaceHeader.jsx  (dropdown: Settings / Log Out)
│   │   │   │   ├── FolderChip.jsx
│   │   │   │   ├── FormCard.jsx
│   │   │   │   └── CreateTypebotCard.jsx
│   │   │   └── pages/DashboardHome.jsx
│   │   │
│   │   ├── form-builder/            Form editor (Flow / Theme / Response tabs)
│   │   │   ├── themes.js            (Light / Dark / Tail Blue palette)
│   │   │   ├── blockTypes.js        (11 block types + metadata)
│   │   │   ├── hooks/useSubmissions.js
│   │   │   ├── components/
│   │   │   │   ├── FormBuilderTopbar.jsx
│   │   │   │   ├── BlockPalette.jsx
│   │   │   │   ├── FlowCanvas.jsx
│   │   │   │   ├── BlockRenderer.jsx
│   │   │   │   ├── ThemeTab.jsx
│   │   │   │   └── ResponseTab.jsx
│   │   │   └── pages/FormBuilderPage.jsx
│   │   │
│   │   ├── public-form/             Chat interface at /f/:formId
│   │   │   ├── api/publicFormApi.js
│   │   │   ├── hooks/usePublicForm.js
│   │   │   ├── components/
│   │   │   │   ├── BotAvatar.jsx
│   │   │   │   ├── ChatMessage.jsx
│   │   │   │   └── ChatInput.jsx
│   │   │   └── pages/PublicFormPage.jsx
│   │   │
│   │   ├── settings/                Profile, password, workspace clear, delete account
│   │   │   └── pages/SettingsPage.jsx
│   │   │
│   │   └── theme/                   Global theme state
│   │       ├── themeStore.js
│   │       └── ThemeApplier.jsx     (sets <html data-theme="..."/> on change)
│   │
│   └── mocks/                       MSW handlers (currently disabled)
│       ├── browser.js
│       └── handlers.js
│
├── .env.development                 VITE_API_URL, VITE_USE_MOCK_API=false
├── .env.production
├── vite.config.js                   Path aliases (@config, @features, @shared)
├── tailwind.config.js               Content globs, theme tokens
├── postcss.config.js
└── package.json
```

### Path aliases (from `vite.config.js`)

```js
resolve: {
  alias: {
    '@config': path.resolve(__dirname, 'src/config'),
    '@shared': path.resolve(__dirname, 'src/shared'),
    '@features': path.resolve(__dirname, 'src/features'),
  }
}
```

Every import uses these aliases for stable, readable module paths.

---

## Application Bootstrap

```
main.jsx
   │
   ▼
bootstrap()                    ← Optionally starts MSW (dev only)
   │
   ▼
ReactDOM.createRoot().render(<App />)
   │
   ▼
App.jsx  →  <AppProviders>{children}</AppProviders>
   │
   ▼
AppProviders (app/providers.jsx)
   ├── BrowserRouter                  (React Router)
   ├── QueryClientProvider            (TanStack Query)
   ├── ThemeApplier                   (mounts data-theme on <html>)
   ├── {children}                     ← AppRouter renders here
   └── Toaster                        (react-hot-toast)
```

**`main.jsx`** — reads `VITE_USE_MOCK_API`. When `true`, dynamically imports `./mocks/browser.js` and starts MSW before rendering. When `false` (default now), skips MSW entirely.

**`AppProviders`** — the DI container of the frontend. If you add a new global provider (e.g., IntlProvider), it goes here.

---

## Routing

Route table in `src/app/router.jsx`:

| Path | Element | Auth |
|------|---------|:---:|
| `/` | `LandingPage` | ❌ |
| `/login` | `LoginPage` (wrapped in `PublicOnlyRoute`) | ❌ |
| `/register` | `RegisterPage` (wrapped in `PublicOnlyRoute`) | ❌ |
| `/f/:formId` | `PublicFormPage` | ❌ |
| `/dashboard` | `DashboardLayout` (wrapped in `ProtectedRoute`) | ✅ |
| ↳ `/dashboard` index | `DashboardHome` | ✅ |
| ↳ `/dashboard/settings` | `SettingsPage` | ✅ |
| `/dashboard/forms/:formId` | `FormBuilderPage` (protected) | ✅ |
| `*` | `NotFound` | — |

### Guards

**`ProtectedRoute`** (`src/features/auth/components/ProtectedRoute.jsx`):
- Reads `isAuthenticated` from `authStore`
- If not authenticated → redirects to `/login`
- Else → renders children

**`PublicOnlyRoute`**:
- Reads `isAuthenticated` from `authStore`
- If already authenticated → redirects to `/dashboard`
- Prevents logged-in users from hitting `/login` again

---

## State Management

Three complementary tools, each with a clear responsibility:

### 1. Server data → **TanStack Query**

Anything that comes from the API (folders, forms, submissions, public forms, users).

**Query keys convention:**
- `['folders']`
- `['forms', { folderId }]`
- `['forms', id]`
- `['submissions', formId]`
- `['public-form', id]`

**Hooks pattern** (see `src/features/dashboard/hooks/useFolders.js`):
```js
export function useFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: async () => (await foldersApi.list()).data,
    staleTime: 30_000,
  })
}

export function useCreateFolder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: foldersApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['folders'] }),
    onError: (err) => toast.error(errorMessage(err)),
  })
}
```

Mutations always **invalidate related query keys** so the UI reflects fresh server state.

### 2. Auth session → **Zustand (with persist)**

`src/features/auth/store/authStore.js` — holds `user`, `token`, `isAuthenticated`. Persisted to `localStorage['formbuilder-auth']`. Rehydrates on app load via `hydrate()`.

### 3. UI-only state → **Zustand (small stores)**

- `workspaceStore` — only `activeFolderId` (which folder is currently being viewed)
- `themeStore` — global theme id (light/dark/tail-blue), persisted

**No server data lives in Zustand.** That's the golden rule — server data belongs to React Query.

### Why this split?

- Zustand for **client state** (auth session, UI toggles) — needs to be synchronous, needs to persist
- React Query for **server state** — needs cache, background refetch, invalidation, retry, loading/error states, deduplication
- Local `useState` for **transient UI** (modal open, input value)

---

## API Integration

### Base client (`src/config/api.js`)

```js
export const apiClient = axios.create({
  baseURL: env.API_URL,     // http://localhost:5000/api
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})
```

### Request interceptor — attaches JWT

```js
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### Response interceptor — handles 401

```js
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const onPublic = /^\/(login|register|f\/|$)/.test(window.location.pathname)
      if (!onPublic) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)
```

### `unwrap()` helper

Backend always returns `{ success, data, message, errors }`. Every API function calls `unwrap()` to normalize:

```js
export function unwrap(response) {
  const body = response?.data
  if (!body || !('success' in body)) {
    return { data: body, message: null }
  }
  if (!body.success) {
    const err = new Error(body.message || 'Request failed')
    err.errors = body.errors
    throw err
  }
  return { data: body.data, message: body.message }
}
```

### `errorMessage()` helper

```js
export function errorMessage(error, fallback = 'Something went wrong') {
  return (
    error?.response?.data?.message ||
    error?.apiMessage ||
    error?.message ||
    fallback
  )
}
```

### API function pattern

Every API module follows this shape:

```js
// src/features/dashboard/api/foldersApi.js
import { apiClient, unwrap } from '@config/api.js'

export const foldersApi = {
  async list() {
    const res = await apiClient.get('/folders')
    return unwrap(res)      // returns { data, message }
  },
  async create(payload) {
    const res = await apiClient.post('/folders', payload)
    return unwrap(res)
  },
  // ...
}
```

Then hooks consume it:

```js
async () => (await foldersApi.list()).data   // just the payload
```

---

## Authentication Flow

See `docs/04_AUTH_FLOW.md` for the full JWT deep-dive.

**Frontend-side summary:**

1. **Register / Login** → backend returns `{ token, user }`
2. `setSession(user, token)` in `authStore`:
   - Writes `auth_token` + `auth_user` to `localStorage`
   - Sets `isAuthenticated: true`
3. Auto-syncs user's theme preference via `useThemeStore.getState().setTheme(...)` (see `useAuth.js`)
4. Navigates to `/dashboard`
5. On any subsequent API call, the axios request interceptor attaches `Authorization: Bearer <token>`
6. On page reload, `AppProviders` calls `hydrate()` from `authStore` — rehydrates from `localStorage`
7. On 401, response interceptor clears session + redirects to `/login`
8. On logout, `authApi.logout()` (fire-and-forget) + `clearSession()` + navigate

---

## Theme System

Global, applies to the whole app. Three themes: `light`, `dark`, `tail-blue`.

### 1. Storage — `themeStore`

Zustand with `persist` to `localStorage['formbuilder-theme']`:

```js
export const useThemeStore = create(
  persist(
    (set) => ({
      themeId: 'dark',
      setTheme: (themeId) => { if (THEME_IDS.includes(themeId)) set({ themeId }) },
    }),
    { name: 'formbuilder-theme' }
  )
)
```

### 2. DOM sync — `ThemeApplier`

```jsx
export function ThemeApplier() {
  const themeId = useThemeStore((s) => s.themeId)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
  }, [themeId])
  return null
}
```

Mounted once in `AppProviders`. Sets `<html data-theme="dark">` (or `light` / `tail-blue`).

### 3. CSS — `src/index.css`

CSS variables per theme:

```css
html[data-theme='dark'] {
  --app-bg: #121212;
  --app-surface: #1A1A1D;
  --app-surface-2: #252528;
  --app-text: #FFFFFF;
  --app-text-muted: rgba(255, 255, 255, 0.7);
  --app-border: rgba(255, 255, 255, 0.1);
  --app-accent: #1A5FFF;
  ...
}

html[data-theme='light'] { --app-bg: #F7F8FF; ...  }
html[data-theme='tail-blue'] { --app-bg: #508C9B; ... }
```

Utility classes:
```css
.app-bg { background-color: var(--app-bg); }
.app-surface { background-color: var(--app-surface); }
.app-text { color: var(--app-text); }
.app-border { border-color: var(--app-border); }
/* etc. */
```

### 4. Server sync

On login/register, `useAuth.js` extracts `user.preferences.themeId` from the response and calls `useThemeStore.setTheme()`.

When user picks a theme in `ThemeTab`, it does both:
1. Local update (`useThemeStore.setTheme(id)`) — instant visual change
2. Server sync (`authApi.updatePreferences({ themeId })`) — persists to Mongo

### Pages that opt out of the theme

- **Landing page**, **Login/Register** — designed dark with brand decorations, use hard-coded colors (not `app-*` classes)
- **Public form** (`/f/:formId`) — uses the theme's chat-widget palette from `form-builder/themes.js`

---

## Form Handling

Login and Register forms use `react-hook-form` + `zod` for validation.

### Zod schemas — `src/features/auth/schemas/authSchemas.js`

```js
export const loginSchema = z.object({
  email: z.string().min(1, { message: 'Email is required' }).email(...),
  password: z.string().min(1).min(6, { message: 'Password must be at least 6 characters' }),
})

export const registerSchema = z.object({
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_.-]+$/),
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'enter same password in both fields',
  path: ['confirmPassword'],
})
```

### Form component pattern

```jsx
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(loginSchema),
  defaultValues: { email: '', password: '' },
})

<form onSubmit={handleSubmit(onSubmit)}>
  <input {...register('email')} />
  {errors.email && <p>{errors.email.message}</p>}
  ...
</form>
```

### Reusable `PasswordInput`

`src/features/auth/components/PasswordInput.jsx` — wraps a native `<input>` and adds an eye/eye-off toggle. Uses `forwardRef` so it works with react-hook-form's `register`.

Used in: Login, Register (2×), Settings (3×).

---

## Modal System

Three composable pieces:

### `Modal` (base)

`src/shared/components/ui/Modal.jsx`:
- Renders via `createPortal` into `<body>` (so it's not nested inside other stacking contexts)
- Backdrop with `bg-black/70 backdrop-blur-sm`
- ESC key closes
- Click-outside closes
- Body scroll locked while open
- Animations: `animate-fade-in` (backdrop), `animate-slide-up` (dialog)

### `PromptModal` (input + Save)

Uses `Modal` + a form with a text input. Used for **Create folder** and **Create form**.

### `ConfirmModal` (message + Delete)

Uses `Modal` + warning icon + Cancel/Delete buttons. Supports 3 tones:
- `danger` (red) — delete operations
- `warning` (orange) — logout
- `info` (blue)

Used for delete-folder, delete-form, delete-response, log-out, delete-account.

---

## Toast Notifications

`react-hot-toast` mounted in `AppProviders`:

```jsx
<Toaster
  position="top-right"
  toastOptions={{
    style: { background: 'hsl(240 10% 8%)', color: '#fff', borderRadius: '8px', ... }
  }}
/>
```

Usage anywhere:
```js
import toast from 'react-hot-toast'

toast.success('Saved')
toast.error('Failed to save')
toast('info message', { icon: 'ℹ️' })
```

Every React Query mutation calls `toast.error(errorMessage(err))` in its `onError`, and `toast.success(message)` in `onSuccess`.

---

## Form Builder Data Model

### Block types (11)

Defined in `src/features/form-builder/blockTypes.js`:

| Group | Types |
|-------|-------|
| **Bubbles** (bot messages) | `text-bubble`, `image-bubble`, `video-bubble`, `gif-bubble` |
| **Inputs** (user answers) | `text-input`, `number-input`, `email-input`, `phone-input`, `date-input`, `rating-input`, `buttons-input` |

Each has an icon (lucide-react) and label.

### Block shape

```js
{
  id: 'b1',
  type: 'text-bubble',
  data: { content: 'Hello!' }        // shape depends on type
}
```

### `data` schemas by type

```
text-bubble          { content: string }
image/video/gif      { url: string }
text/number/email/phone
                     { label, placeholder?, required }
date-input           { label, required }
rating-input         { label, max: number, required }
buttons-input        { label, options: string[], required }
```

### Form update flow

Every block edit fires `useUpdateForm.mutate({ id, blocks: newBlocksArray })`. The mutation:
1. Sends `PUT /api/forms/:id` with the full blocks array
2. On success, updates the query cache (`qc.setQueryData([FORMS_KEY, data.id], data)`)
3. Invalidates the forms list

This is intentionally "replace the whole blocks array" — simpler than tracking granular ops. For very large forms (100+ blocks), consider granular endpoints.

### Public form chat flow

`PublicFormPage.jsx` state machine:
- `step` — current block index
- `messages[]` — accumulated chat history
- `answers` — dict of blockId → user's answer
- `awaitingInput` — whether we're paused for the current input
- `finished` — completion flag

Bubble blocks auto-play with 400ms stagger. Input blocks pause and render `ChatInput`. On submit, `useSubmitPublicForm.mutate(answers)` sends everything to the backend.

---

## Environment Configuration

Vite reads any variable prefixed with `VITE_` from `.env*` files.

### Files

- **`.env.development`** — loaded by `npm run dev`
  ```
  VITE_API_URL=http://localhost:5000/api
  VITE_USE_MOCK_API=false
  ```
- **`.env.production`** — loaded by `npm run build`
  ```
  VITE_API_URL=https://your-api-domain.com/api
  VITE_USE_MOCK_API=false
  ```
- **`.env.local`** — machine-specific overrides (git-ignored — safe for secrets in dev)

### Reading them

Only via `src/config/env.js`:

```js
export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  USE_MOCK_API: import.meta.env.VITE_USE_MOCK_API === 'true',
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
}
```

Never read `import.meta.env` directly in components — go through `env.js` so we have one place to type-check and default.

---

## Development & Build

### Dev server

```powershell
cd FormBuilder.UI
npm install    # first time only
npm run dev
```

Vite picks the first free port (5173+). HMR is automatic — save a file, browser updates instantly without losing state.

### Production build

```powershell
npm run build
```

Outputs to `dist/`:
- One `index.html`
- Bundled JS (code-split by route)
- Bundled CSS
- Static assets from `public/`

Deploy `dist/` to any static host (Vercel, Netlify, Cloudflare Pages, Azure Static Web Apps).

### Preview build locally

```powershell
npm run preview
```

Serves `dist/` on port 4173. Use this to sanity-check the production bundle before deploying.

---

## Adding a New Feature

Recipe:

1. **Create a feature folder**: `src/features/mynew/`
2. **API module**: `api/myApi.js` — one object with async functions calling `apiClient` + `unwrap()`
3. **React Query hooks**: `hooks/useMyThings.js` — `useQuery` for reads, `useMutation` for writes
4. **Components**: `components/` — pure presentational + smart components
5. **Pages**: `pages/MyPage.jsx` — composition
6. **Register in router** (`src/app/router.jsx`)
7. **Optional Zustand store** for local UI state

### Example: add a "Templates" feature

```
src/features/templates/
├── api/templatesApi.js       (list, getById, useTemplate)
├── hooks/useTemplates.js
├── components/TemplateCard.jsx
└── pages/TemplatesPage.jsx
```

Then in `router.jsx`:
```jsx
<Route path="/dashboard/templates" element={<TemplatesPage />} />
```

Done — no changes to other features needed.

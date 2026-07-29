# UI → API Cheat Sheet

Quick lookup: for every button/action in the current React UI, what API call to make.

Use this when implementing controllers — pick a UI action, see the endpoint that's needed.

---

## 🌐 Public Pages

### Landing Page (`/`)

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Page load | None | 100% static content |
| Click "Sign in" | None | Navigates to `/login` |
| Click "Create a FormBot" | None | Navigates to `/register` |

### Login (`/login`)

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Submit login form | `POST /api/auth/login` | Store token+user in localStorage; redirect to `/dashboard` |
| Click eye icon | None | Client-side password visibility toggle |
| Click "Register now" link | None | Navigate to `/register` |

### Register (`/register`)

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Submit signup form | `POST /api/auth/register` | Store token+user; redirect to `/dashboard` |
| Click eye icon | None | Password visibility toggle |
| Click "Login" link | None | Navigate to `/login` |

---

## 🔐 Protected Pages (JWT required)

### Dashboard (`/dashboard`)

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Page load | `GET /api/auth/me` + `GET /api/folders` + `GET /api/forms` | 3 requests in parallel |
| Click workspace dropdown | None | Client-side toggle |
| Click "Settings" (dropdown) | None | Navigate to `/dashboard/settings` |
| Click "Log Out" (dropdown) | `POST /api/auth/logout` | Then clear localStorage + navigate to `/login` |
| Click "Create a folder" | `POST /api/folders` | After user submits modal with name |
| Click folder chip | None | Client-side filter (sets `activeFolderId`) |
| Click "← Back to all" | None | Client-side (clears filter) |
| Click red trash on folder chip | `DELETE /api/folders/:id` | After confirming in modal. Cascades to delete forms in folder. |
| Click "Create a typebot" (blue card) | `POST /api/forms` | After user submits modal. Response = new form → navigate to `/dashboard/forms/:id` |
| Click a form card | None | Navigate to `/dashboard/forms/:id` |
| Click red trash on form card | `DELETE /api/forms/:id` | After confirming in modal |

### Form Builder — Flow Tab (`/dashboard/forms/:formId`)

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Page load | `GET /api/forms/:formId` | Full form with blocks |
| Type in form name input, blur/Enter | `PUT /api/forms/:formId` | Body: `{ "name": "New name" }` |
| Click any block in palette | `PUT /api/forms/:formId` | Full blocks array. Frontend adds a new block, sends the whole array |
| Edit a block's content (any editor) | `PUT /api/forms/:formId` | Debounced. Send updated blocks array. |
| Click block's ⬆️/⬇️ (reorder) | `PUT /api/forms/:formId` | Frontend swaps positions, sends new blocks array |
| Click block's trash icon | `PUT /api/forms/:formId` | Frontend removes from blocks array, sends the rest |
| Click "Save" button (green) | `PUT /api/forms/:formId` | Explicit save. Shows toast. |
| Click "Share" button (blue) | None | Copies `${origin}/f/${form.id}` to clipboard |
| Click "X" close (red) | None | Navigate to `/dashboard` |

### Form Builder — Theme Tab

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Tab open | None | Uses form data already fetched |
| Click a theme card | `PUT /api/users/me/preferences` | Body: `{ "themeId": "dark" }` — GLOBAL user preference |

### Form Builder — Response Tab

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Tab open | `GET /api/forms/:formId/submissions` | Returns stats + submissions list |
| Click "+ Add sample response" | None | Frontend-only dev tool. In prod, remove this button. |
| Click "Export CSV" | None | Generates CSV client-side from data already fetched |
| Click red trash on a row | `DELETE /api/forms/:formId/submissions/:submissionId` | After confirming in modal |

### Settings (`/dashboard/settings`)

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Page load | Uses current auth state (no new call) | Or `GET /api/auth/me` to refresh |
| Save profile section | `PUT /api/users/me` | Body: `{ "fullName": "...", "email": "..." }` |
| Save password section | `PUT /api/users/me/password` | Body: `{ "currentPassword": "...", "newPassword": "..." }` |
| Click "Clear all folders and forms" | `DELETE /api/users/me/workspace` | After confirming in modal |
| Click "Log out" (orange section) | `POST /api/auth/logout` | Then clear localStorage + navigate to `/login` |
| Click "Delete account" (danger zone) | `DELETE /api/users/me` | After confirming in modal |

---

## 🌍 Public Form Fill (`/f/:formId`)

**No JWT required.** These endpoints are open.

| UI Action | API Call | Notes |
|-----------|----------|-------|
| Page load | `GET /api/public/forms/:formId` | Public-safe view of the form |
| Immediately after load | `POST /api/public/forms/:formId/view` | Increment view count |
| Visitor answers first input | `POST /api/public/forms/:formId/start` | *(optional)* Track "start" |
| Visitor submits after last block | `POST /api/public/forms/:formId/submissions` | Body: `{ values: { blockId: answer, ... } }` |
| Bot messages auto-display | None | All content already in the fetched form |
| Bot media (image/video) | None | Just renders the URL from block data |
| User input send (text/number/email/phone/date) | None (per input) | Only the final submission POST at the end |
| User taps rating star | None (per star) | Same |
| User taps a button option | None (per button) | Same |

**Note on batching**: Currently, the frontend collects ALL answers in local state, then sends **one submission** at the end. If you want each answer to be persisted incrementally (for tracking abandonment or resuming later), you'd add:
```
POST /api/public/forms/:formId/answers
Body: { blockId, value }
```
This is optional — start with just the final POST.

---

## HTTP method summary

Method | When to use
---|---
`GET` | Read. Never modify data.
`POST` | Create a new resource. Or perform an action that changes state (like `/view`, `/logout`).
`PUT` | Replace an existing resource. Send the full updated object.
`PATCH` | Update part of an existing resource. Send only what changed. *(We don't use PATCH in this app — PUT is enough.)*
`DELETE` | Remove a resource.

## Response status codes

Code | Meaning | Example
---|---|---
`200 OK` | Success with body | GET returned data
`201 Created` | Success + resource was created | POST returned new folder
`204 No Content` | Success, no body | DELETE succeeded
`400 Bad Request` | Client sent invalid data | Missing required field
`401 Unauthorized` | Not authenticated | Token missing/expired
`403 Forbidden` | Authenticated but not allowed | Trying to access someone else's form
`404 Not Found` | Resource doesn't exist | GET /api/forms/nonexistent
`409 Conflict` | Would violate a uniqueness rule | Email already registered
`422 Unprocessable Entity` | Validation failed (semantic) | Same as 400, some devs prefer this for validation
`429 Too Many Requests` | Rate limited | Too many login attempts
`500 Internal Server Error` | Something broke on the server | Bug — do NOT return the stack trace to the client

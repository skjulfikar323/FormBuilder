# Workflow — Follow a User Through the App

This document walks through **every screen** of Form Builder, in the order a user experiences them, and shows **exactly which API calls happen** at each step.

Read this **first**. Then everything in `02_API_REFERENCE.md` will make sense.

---

## Chapter 1 — Visitor arrives

### 📍 URL: `/`
### 🎨 Screen: Landing Page

**What happens on the UI:**
- The user opens `http://your-site.com/`
- They see the marketing page: "Build advanced chatbots visually" + feature sections + testimonials + footer
- Two prominent buttons: **"Sign in"** and **"Create a FormBot"**

**API calls made:** ❌ **None.** The landing page is 100% static — pure marketing content. No backend needed.

**User clicks "Create a FormBot"** → browser navigates to `/register`.
**Or clicks "Sign in"** → browser navigates to `/login`.

---

## Chapter 2 — User registers

### 📍 URL: `/register`
### 🎨 Screen: Signup Screen

**What the user sees:**
- Dark background with decorative orange triangle + salmon/peach circles
- Form with 4 fields: **Username**, **Email**, **Password**, **Confirm Password**
- Password fields have an **eye icon** to show/hide
- Blue **"Sign Up"** button
- Below: "Already have an account? **Login**"

**User fills the form and clicks Sign Up.**

### 🔌 API Call: Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "julfikar",
  "email": "julfikar@example.com",
  "password": "Secret123!"
}
```

**Backend does:**
1. Validate all 3 fields are present
2. Check username doesn't already exist → if it does, return `409 Conflict`
3. Check email doesn't already exist → if it does, return `409 Conflict`
4. Hash the password using **BCrypt** (never store plain-text!)
5. Insert into MongoDB `users` collection with `role: "user"` and `createdAt: now`
6. Generate a **JWT token** (see `04_AUTH_FLOW.md`) valid for 7 days
7. Return the token + user object

**Successful response `201 Created`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "651a7b3c9f1a2b3c4d5e6f70",
    "username": "julfikar",
    "email": "julfikar@example.com",
    "fullName": "julfikar",
    "role": "user"
  }
}
```

**Frontend does after receiving:**
- Stores the `token` in `localStorage['auth_token']`
- Stores the `user` in `localStorage['auth_user']`
- Also stores both in a Zustand `useAuthStore`
- **Navigates to `/dashboard`**

---

## Chapter 3 — Or the user logs in instead

### 📍 URL: `/login`
### 🎨 Screen: Login Screen

**What the user sees:**
- Same layout as register (dark bg, triangle, circles)
- 2 fields: **Email**, **Password** (with eye toggle)
- Blue **"Log In"** button
- "Don't have an account? **Register now**"

### 🔌 API Call: Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "julfikar@example.com",
  "password": "Secret123!"
}
```

**Backend does:**
1. Find user in `users` where `email = <email>`
2. If not found → return `401 Unauthorized`
3. Compare the password with the hashed one using `BCrypt.Verify`
4. If mismatch → return `401 Unauthorized`
5. Generate a fresh JWT
6. Return the token + user

**Successful response `200 OK`:**
```json
{
  "token": "eyJ...",
  "user": {
    "id": "651a7b3c9f1a2b3c4d5e6f70",
    "username": "julfikar",
    "email": "julfikar@example.com",
    "fullName": "Julfikar Sk",
    "role": "user"
  }
}
```

**Frontend:** stores token + user, navigates to `/dashboard`.

---

## Chapter 4 — Dashboard

### 📍 URL: `/dashboard`
### 🎨 Screen: Form Dashboard

**What the user sees:**
- Top bar with **workspace dropdown** centered ("`<Name>`'s workspace ▼")
- Toolbar row: **Create a folder** button + folder chips (Computer Networks, HR Forms, etc.)
- Grid: Big blue **Create a typebot** card + gray "New form" cards

### 🔌 On page load, 3 API calls happen in parallel:

**1. Verify auth token**
```http
GET /api/auth/me
Authorization: Bearer eyJ...
```
Returns the current user (useful for the workspace name and to confirm the token is still valid).

```json
{
  "id": "651a7b3c9f1a2b3c4d5e6f70",
  "username": "julfikar",
  "email": "julfikar@example.com",
  "fullName": "Julfikar Sk",
  "role": "user"
}
```

**2. Fetch folders**
```http
GET /api/folders
Authorization: Bearer eyJ...
```

Returns the user's folders:
```json
[
  { "id": "f1", "name": "Computer Networks", "userId": "651...", "createdAt": "..." },
  { "id": "f2", "name": "HR Forms",          "userId": "651...", "createdAt": "..." }
]
```

**3. Fetch forms**
```http
GET /api/forms
Authorization: Bearer eyJ...
```

Optionally with `?folderId=null` for root-level forms, or `?folderId=f1` to filter.

Returns a **lightweight** form list (no blocks, no submissions — just metadata for the grid):
```json
[
  {
    "id": "form-abc",
    "name": "Customer Feedback",
    "folderId": null,
    "views": 42,
    "submissionCount": 8,
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-07-01T14:20:00Z"
  }
]
```

### 🖱️ User clicks "Create a folder"

Modal opens asking for the folder name. User types `Marketing` → clicks **Save**.

```http
POST /api/folders
Authorization: Bearer eyJ...
Content-Type: application/json

{ "name": "Marketing" }
```

Response `201 Created`:
```json
{ "id": "f3", "name": "Marketing", "userId": "651...", "createdAt": "..." }
```

Frontend adds the new folder chip to the toolbar row.

### 🖱️ User clicks trash icon on a folder chip

Confirmation modal → **Delete**:

```http
DELETE /api/folders/f1
Authorization: Bearer eyJ...
```

Backend also cascades — deletes all forms inside that folder + their submissions.

### 🖱️ User clicks "Create a typebot" (big blue card)

Modal opens asking for the form name. User types `Customer Feedback` → **Save**.

```http
POST /api/forms
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "name": "Customer Feedback",
  "folderId": null
}
```

Backend creates a new form with `blocks: []`, `views: 0`, `submissions: []`.

Response `201 Created`:
```json
{
  "id": "form-xyz",
  "name": "Customer Feedback",
  "folderId": null,
  "blocks": [],
  "themeId": "light",
  "views": 0,
  "submissionCount": 0,
  "createdAt": "2026-07-07T18:00:00Z"
}
```

**Frontend navigates to `/dashboard/forms/form-xyz`** → Form Builder opens.

### 🖱️ User clicks the red trash icon on a form card

```http
DELETE /api/forms/form-xyz
Authorization: Bearer eyJ...
```

Cascades to delete all submissions for that form.

---

## Chapter 5 — Form Builder (Flow tab)

### 📍 URL: `/dashboard/forms/:formId`
### 🎨 Screen: Workspace / Form Builder

**What the user sees:**
- Top bar with form name input + Flow/Theme/Response tabs + Share/Save/X
- Left sidebar: **Bubbles** (Text, Image, Video, GIF) + **Inputs** (Text, Number, Email, Phone, Date, Rating, Buttons)
- Center canvas: a "Start" block, and any blocks the user has added

### 🔌 On page load

```http
GET /api/forms/form-xyz
Authorization: Bearer eyJ...
```

Returns the full form including blocks:
```json
{
  "id": "form-xyz",
  "name": "Customer Feedback",
  "folderId": null,
  "themeId": "light",
  "blocks": [
    { "id": "b1", "type": "text-bubble",  "data": { "content": "Hello!" } },
    { "id": "b2", "type": "email-input",  "data": { "label": "Email", "required": true } }
  ],
  "views": 0,
  "submissionCount": 0,
  "createdAt": "...",
  "updatedAt": "..."
}
```

### 🖱️ User adds/edits/removes/reorders blocks

Every change fires an **update-form** request. Simplest approach: **replace the whole blocks array**:

```http
PUT /api/forms/form-xyz
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "name": "Customer Feedback",
  "blocks": [
    { "id": "b1", "type": "text-bubble", "data": { "content": "Hello there!" } },
    { "id": "b2", "type": "email-input", "data": { "label": "Email", "required": true } },
    { "id": "b3", "type": "text-input",  "data": { "label": "Name", "required": true } }
  ]
}
```

Response `200 OK` — returns the updated form.

**Design decision**: PUT is easier than 6 separate endpoints (add-block, remove-block, move-block, etc.). The frontend sends the current state; backend replaces it.

### 🖱️ User renames the form (top-left input)

Same `PUT /api/forms/form-xyz` — the `name` field is included in the payload.

### 🖱️ User clicks the green Save button

The Save button in the current UI just shows a toast — but in the real backend, this is where you'd send the current form state (in case autosave was disabled).

Same endpoint: `PUT /api/forms/form-xyz`.

### 🖱️ User clicks the blue Share button

**No API call.** The frontend generates a link `${origin}/f/${formId}` and copies it to clipboard. The actual sharing happens because the `/f/:formId` route is public (no auth required).

### 🖱️ User clicks the red X close button

**No API call.** Just navigates back to `/dashboard`.

---

## Chapter 6 — Form Builder (Theme tab)

**What the user sees:** left sidebar with "Customize the theme" + 3 theme cards (Light, Dark, Tail Blue) + live preview on the right.

### 🖱️ User picks a theme

Theme is a **user-level global preference**, not per-form.

```http
PUT /api/users/me/preferences
Authorization: Bearer eyJ...
Content-Type: application/json

{ "themeId": "dark" }
```

Response `200 OK`:
```json
{
  "themeId": "dark"
}
```

*(Alternative: put `themeId` on the `users` collection directly and update via `PUT /api/users/me`.)*

---

## Chapter 7 — Form Builder (Response tab)

**What the user sees:** 3 stat cards (Views / Starts / Completion rate) + submissions table with columns per input block.

### 🔌 On tab open

```http
GET /api/forms/form-xyz/submissions
Authorization: Bearer eyJ...
```

Returns:
```json
{
  "form": {
    "id": "form-xyz",
    "views": 42,
    "starts": 15,
    "submissionCount": 8
  },
  "submissions": [
    {
      "id": "sub-1",
      "submittedAt": "2026-07-07T14:23:00Z",
      "values": {
        "b2": "user@example.com",
        "b3": "John Doe"
      }
    }
  ]
}
```

**Completion rate** = `(submissions.length / starts) * 100`. Computed on the frontend.

### 🖱️ User clicks trash icon on a submission row

```http
DELETE /api/forms/form-xyz/submissions/sub-1
Authorization: Bearer eyJ...
```

### 🖱️ User clicks Export CSV

**No API call.** The frontend already has all submissions in memory — generates and downloads the CSV client-side.

*(If you want server-side CSV generation later, add `GET /api/forms/form-xyz/submissions.csv`.)*

---

## Chapter 8 — Sharing the form

The user copies the Share link (e.g., `https://your-site.com/f/form-xyz`) and sends it to their audience via WhatsApp/Slack/email/etc. **This is where the form actually gets filled.**

---

## Chapter 9 — A visitor fills the form (public flow)

### 📍 URL: `/f/form-xyz`
### 🎨 Screen: FormBot Desktop / Mobile chat

**The visitor is NOT logged in.** All endpoints in this chapter are **public** (no `Authorization` header).

### 🔌 On page load — get the form

```http
GET /api/public/forms/form-xyz
```

**Note:** This is a **separate public endpoint** — different from `GET /api/forms/:id` which requires auth (only the owner can see all form details).

Returns a **safe subset** of the form (no submissions, no internal fields):
```json
{
  "id": "form-xyz",
  "name": "Customer Feedback",
  "themeId": "dark",
  "blocks": [
    { "id": "b1", "type": "text-bubble", "data": { "content": "Hello!" } },
    { "id": "b2", "type": "email-input", "data": { "label": "Email", "required": true } }
  ]
}
```

### 🔌 Immediately after — increment views

```http
POST /api/public/forms/form-xyz/view
```

Response `204 No Content` (no data needed).

Backend: `form.views += 1`.

### 🔌 When the visitor answers the first input — track a "start"

```http
POST /api/public/forms/form-xyz/start
```

*(Optional endpoint — you could also just infer starts from submissions. But if you want accurate abandonment stats, track when the first input is answered.)*

Backend: `form.starts += 1`.

### 🔌 When the visitor submits (finishes all blocks) — save the submission

```http
POST /api/public/forms/form-xyz/submissions
Content-Type: application/json

{
  "values": {
    "b2": "user@example.com",
    "b3": "John Doe"
  }
}
```

Response `201 Created`:
```json
{
  "id": "sub-2",
  "submittedAt": "2026-07-07T18:30:00Z"
}
```

The `values` object uses block IDs as keys. The frontend already knows which blockId maps to which label.

### 🔌 Backend validation on submissions

Before saving:
1. Check the form exists
2. For each required input block: validate a value is present in `values`
3. For email inputs: validate email format
4. For number inputs: validate number type
5. For rating inputs: validate the value is between 1 and max

Return `400 Bad Request` with field-level errors if invalid.

---

## Chapter 10 — Settings page

### 📍 URL: `/dashboard/settings`

### 🖱️ User updates profile (Display name + Email)

```http
PUT /api/users/me
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "fullName": "Julfikar Sk",
  "email": "julfikar.new@example.com"
}
```

Response `200 OK` with the updated user.

Backend must:
- Check the new email isn't taken by another user
- Reject the request if it is (409)

### 🖱️ User changes password

```http
PUT /api/users/me/password
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "currentPassword": "OldSecret123",
  "newPassword": "NewSecret456"
}
```

Backend verifies `currentPassword` with BCrypt.Verify before updating.

*(The current frontend doesn't ask for the current password — that's a **security gap** you should fix in the backend spec by requiring it.)*

Response `204 No Content` on success.

### 🖱️ User clicks "Clear all folders and forms"

```http
DELETE /api/users/me/workspace
Authorization: Bearer eyJ...
```

Deletes ALL folders + forms + submissions for this user. Keeps the account itself.

### 🖱️ User clicks "Log out"

```http
POST /api/auth/logout
Authorization: Bearer eyJ...
```

For JWT, logout is client-side (delete the token). But an endpoint is useful if you want to blacklist tokens on the server side.

Frontend: clear `localStorage`, redirect to `/login`.

### 🖱️ User clicks "Delete account" (danger zone)

```http
DELETE /api/users/me
Authorization: Bearer eyJ...
```

Cascades:
1. Delete all their submissions
2. Delete all their forms
3. Delete all their folders
4. Delete the user record
5. Return `204 No Content`

Frontend: clear localStorage, redirect to `/`.

---

## Summary — The 3 categories of endpoints

| Category | Auth required? | Base path |
|----------|----------------|-----------|
| **Auth** (login/register) | No | `/api/auth/*` |
| **App** (dashboard operations) | Yes — Bearer JWT | `/api/folders/*`, `/api/forms/*`, `/api/users/me/*` |
| **Public** (form fill) | No | `/api/public/*` |

Read `02_API_REFERENCE.md` next for the detailed spec of every endpoint.

# API Reference

Complete endpoint catalog. Read `01_WORKFLOW.md` first if you're new — this doc is a build reference.

## Conventions

- **Base URL**: `http://localhost:5000/api` (dev)
- **Content-Type**: `application/json` on requests and responses
- **Auth**: JWT in `Authorization: Bearer <token>` header — required unless marked **PUBLIC**
- **IDs**: MongoDB ObjectIds as 24-char hex strings, e.g. `"651a7b3c9f1a2b3c4d5e6f70"`
- **Timestamps**: ISO 8601 UTC, e.g. `"2026-07-07T18:30:00Z"`

## Standard error shape

Every 4xx / 5xx returns:
```json
{
  "message": "Human-readable summary",
  "errors": {
    "fieldName": ["Field-level error 1", "Field-level error 2"]
  }
}
```

`errors` is optional — only present for `400 Bad Request` validation failures.

---

# 🔐 AUTH

### `POST /api/auth/register` — **PUBLIC**

Create a new account.

**Request**
```json
{
  "username": "julfikar",
  "email": "julfikar@example.com",
  "password": "Secret123!"
}
```

**Validation**
- `username`: required, 3-30 chars, only `[a-zA-Z0-9_.-]`
- `email`: required, valid email format
- `password`: required, ≥ 8 characters

**Response `201 Created`**
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

**Errors**
- `400` — validation failed (see `errors` object)
- `409` — username or email already taken

---

### `POST /api/auth/login` — **PUBLIC**

Authenticate an existing user.

**Request**
```json
{
  "email": "julfikar@example.com",
  "password": "Secret123!"
}
```

**Response `200 OK`**
```json
{
  "token": "eyJ...",
  "user": {
    "id": "651...",
    "username": "julfikar",
    "email": "julfikar@example.com",
    "fullName": "Julfikar Sk",
    "role": "user"
  }
}
```

**Errors**
- `401` — invalid email or password
- `400` — missing fields

---

### `GET /api/auth/me`

Get the current authenticated user (used to verify the token is still valid and pull fresh user data on page load).

**Response `200 OK`**
```json
{
  "id": "651...",
  "username": "julfikar",
  "email": "julfikar@example.com",
  "fullName": "Julfikar Sk",
  "role": "user",
  "preferences": {
    "themeId": "dark"
  }
}
```

**Errors**
- `401` — no token, expired token, or user deleted

---

### `POST /api/auth/logout`

Logout the current user. For JWT this is optional (client just deletes the token), but useful if you want to maintain a server-side token blacklist.

**Response `204 No Content`**

---

# 👤 USER

### `PUT /api/users/me`

Update the current user's profile.

**Request** (all fields optional — only include what changes)
```json
{
  "fullName": "Julfikar Sk",
  "email": "julfikar.new@example.com"
}
```

**Response `200 OK`** — the updated user (same shape as `GET /api/auth/me`)

**Errors**
- `400` — validation
- `409` — new email is taken

---

### `PUT /api/users/me/password`

Change the current user's password.

**Request**
```json
{
  "currentPassword": "OldSecret123",
  "newPassword": "NewSecret456"
}
```

**Validation**
- `currentPassword`: required, must match the stored hash
- `newPassword`: required, ≥ 8 characters, must be different from current

**Response `204 No Content`**

**Errors**
- `401` — current password wrong
- `400` — new password too short / same as old

---

### `PUT /api/users/me/preferences`

Update user preferences (currently just theme).

**Request**
```json
{ "themeId": "dark" }
```

**Validation**
- `themeId`: must be one of `"light"`, `"dark"`, `"tail-blue"`

**Response `200 OK`**
```json
{ "themeId": "dark" }
```

---

### `DELETE /api/users/me/workspace`

Clear all folders + forms + submissions for the current user. **Does NOT delete the account.**

**Response `204 No Content`**

---

### `DELETE /api/users/me`

Delete the current user's account and all their data (cascades to folders, forms, submissions).

**Response `204 No Content`**

---

# 📁 FOLDERS

### `GET /api/folders`

List all folders belonging to the current user.

**Response `200 OK`**
```json
[
  {
    "id": "f1",
    "name": "Computer Networks",
    "userId": "651...",
    "createdAt": "2026-01-15T10:00:00Z"
  },
  {
    "id": "f2",
    "name": "HR Forms",
    "userId": "651...",
    "createdAt": "2026-02-20T12:30:00Z"
  }
]
```

---

### `POST /api/folders`

Create a new folder.

**Request**
```json
{ "name": "Marketing" }
```

**Validation**
- `name`: required, 1-100 chars

**Response `201 Created`**
```json
{
  "id": "f3",
  "name": "Marketing",
  "userId": "651...",
  "createdAt": "2026-07-07T18:00:00Z"
}
```

---

### `PUT /api/folders/:id`

Rename a folder.

**Request**
```json
{ "name": "Marketing Q3" }
```

**Response `200 OK`** — the updated folder

**Errors**
- `404` — folder not found or doesn't belong to the user
- `400` — validation

---

### `DELETE /api/folders/:id`

Delete a folder AND cascade-delete all forms inside it (including their submissions).

**Response `204 No Content`**

**Errors**
- `404` — folder not found or doesn't belong to the user

---

# 📝 FORMS

### `GET /api/forms`

List the current user's forms. Supports optional filter by folder.

**Query params**
- `folderId` — optional. Filter to a specific folder. Use `folderId=null` for root-level forms only.

**Response `200 OK`** — lightweight list (no blocks, no submissions):
```json
[
  {
    "id": "form-abc",
    "name": "Customer Feedback",
    "folderId": null,
    "themeId": "light",
    "views": 42,
    "submissionCount": 8,
    "createdAt": "2026-01-15T10:00:00Z",
    "updatedAt": "2026-07-01T14:20:00Z"
  }
]
```

---

### `GET /api/forms/:id`

Get a single form with its full blocks array (needed for the Form Builder).

**Response `200 OK`**
```json
{
  "id": "form-abc",
  "name": "Customer Feedback",
  "folderId": null,
  "themeId": "light",
  "blocks": [
    { "id": "b1", "type": "text-bubble", "data": { "content": "Hello!" } },
    { "id": "b2", "type": "email-input", "data": { "label": "Email", "placeholder": "you@example.com", "required": true } },
    { "id": "b3", "type": "rating-input", "data": { "label": "Rate us", "max": 5, "required": false } }
  ],
  "views": 42,
  "starts": 15,
  "submissionCount": 8,
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Errors**
- `404` — form not found or doesn't belong to the user

---

### `POST /api/forms`

Create a new form (empty, no blocks).

**Request**
```json
{
  "name": "Customer Feedback",
  "folderId": null
}
```

**Validation**
- `name`: required, 1-200 chars
- `folderId`: optional. If provided, must be an existing folder owned by the user.

**Response `201 Created`** — new form object (same shape as `GET /api/forms/:id`)

---

### `PUT /api/forms/:id`

Update a form's name, folder, or blocks. Send the FULL current state — backend replaces the previous version.

**Request** (all fields optional; include what needs updating)
```json
{
  "name": "Customer Feedback v2",
  "folderId": "f2",
  "blocks": [
    { "id": "b1", "type": "text-bubble",  "data": { "content": "Welcome!" } },
    { "id": "b2", "type": "email-input",  "data": { "label": "Email", "required": true } },
    { "id": "b3", "type": "buttons-input", "data": { "label": "Interested?", "options": ["Yes", "No"], "required": true } }
  ]
}
```

**Validation**
- `name`: if present, 1-200 chars
- `folderId`: if present, must exist and belong to the user (or be `null` for root)
- `blocks`: if present, must be an array. Each block:
  - `id`: string, unique within the form
  - `type`: one of the 11 valid types (see below)
  - `data`: object matching the type's schema

**Response `200 OK`** — updated form

---

### `DELETE /api/forms/:id`

Delete a form and cascade-delete all its submissions.

**Response `204 No Content`**

---

## Valid block types

Type | Group | Purpose | `data` fields
---|---|---|---
`text-bubble` | Bubble | Bot text message | `content: string`
`image-bubble` | Bubble | Bot image | `url: string`
`video-bubble` | Bubble | Bot video | `url: string`
`gif-bubble` | Bubble | Bot GIF | `url: string`
`text-input` | Input | Free-text field | `label`, `placeholder`, `required`
`number-input` | Input | Numeric field | `label`, `placeholder`, `required`
`email-input` | Input | Email field | `label`, `placeholder`, `required`
`phone-input` | Input | Phone field | `label`, `placeholder`, `required`
`date-input` | Input | Date picker | `label`, `required`
`rating-input` | Input | 1–N stars | `label`, `max: number`, `required`
`buttons-input` | Input | Multiple choice | `label`, `options: string[]`, `required`

---

# 📊 SUBMISSIONS (owner view)

### `GET /api/forms/:id/submissions`

Get all submissions for a form (owner-only). Also returns aggregate stats.

**Response `200 OK`**
```json
{
  "form": {
    "id": "form-abc",
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
        "b3": 5
      }
    },
    {
      "id": "sub-2",
      "submittedAt": "2026-07-07T14:31:00Z",
      "values": {
        "b2": "another@example.com",
        "b3": 4
      }
    }
  ]
}
```

Response also supports pagination via `?limit=50&cursor=<submissionId>` for large datasets.

---

### `DELETE /api/forms/:id/submissions/:submissionId`

Delete a single submission.

**Response `204 No Content`**

---

# 🌍 PUBLIC (form fill)

**No auth required for these endpoints.** Rate-limit them to prevent abuse (e.g., 60 req/min per IP).

### `GET /api/public/forms/:id`

Get the public-safe view of a form (for filling out).

**Response `200 OK`** — no submissions, no `starts`, no `views` count:
```json
{
  "id": "form-abc",
  "name": "Customer Feedback",
  "themeId": "dark",
  "blocks": [
    { "id": "b1", "type": "text-bubble", "data": { "content": "Hello!" } },
    { "id": "b2", "type": "email-input", "data": { "label": "Email", "placeholder": "you@example.com", "required": true } }
  ]
}
```

**Errors**
- `404` — form doesn't exist or has been deleted

---

### `POST /api/public/forms/:id/view`

Increment view count. Called when the public form page loads.

**Response `204 No Content`**

---

### `POST /api/public/forms/:id/start`

*(Optional)* Track when a user starts answering. Increments `starts`.

**Response `204 No Content`**

---

### `POST /api/public/forms/:id/submissions`

Save a completed submission.

**Request**
```json
{
  "values": {
    "b2": "user@example.com",
    "b3": 5,
    "b4": "Great product!"
  }
}
```

Keys are block IDs. Backend validates:
- Every `required: true` input block has a value
- Email inputs are valid emails
- Number/rating are numeric
- Rating values are in range `[1, max]`

**Response `201 Created`**
```json
{
  "id": "sub-3",
  "submittedAt": "2026-07-07T15:00:00Z"
}
```

**Errors**
- `400` — validation failed (returns `errors` with per-block-id issues)
- `404` — form doesn't exist

---

# 🔧 Backend implementation checklist

| Concern | How to handle |
|---------|---------------|
| **JWT signing** | Use `System.IdentityModel.Tokens.Jwt` (built-in .NET). Secret key in `appsettings.json` (dev) or Azure Key Vault (prod). 7-day expiration recommended. |
| **Password hashing** | Use `BCrypt.Net-Next` NuGet package. Never store plain-text passwords. |
| **MongoDB driver** | `MongoDB.Driver` NuGet — official. Supports LINQ queries. |
| **CORS** | Allow `http://localhost:5178` and your production frontend domain. |
| **Rate limiting** | Use ASP.NET Core built-in `AspNetCoreRateLimit` — 60 req/min per IP for public endpoints, higher for authenticated. |
| **Validation** | Use `FluentValidation` NuGet — cleaner than data-annotations for complex rules. |
| **Logging** | Serilog to console (dev) + rolling file / Application Insights (prod). |
| **Swagger** | `Swashbuckle.AspNetCore` — auto-generates `/swagger` docs matching this reference. |

Read `03_DATA_MODELS.md` for the MongoDB schema.

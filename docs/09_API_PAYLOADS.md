# API Payloads — Sample Requests & Responses

Complete sample payloads for every endpoint. Copy-paste into Postman / Swagger / cURL.

**Base URL (dev):** `http://localhost:5000/api`
**Base URL (prod):** `https://your-api-domain.com/api`

**Authentication:** For protected endpoints, include:
```
Authorization: Bearer <JWT-from-login-response>
```

**Content-Type:** `application/json` on every request.

**Response envelope:** Every response follows this shape:
```json
{
  "success": true,
  "data": { ... },
  "message": "Human-readable message",
  "errors": null
}
```
On failure, `success: false`, `data: null`, and `errors` may contain field-level details.

---

## Table of Contents

- **Auth** (5)
  1. [Register](#1-register)
  2. [Login](#2-login)
  3. [Get Current User](#3-get-current-user)
  4. [Change Password](#4-change-password)
  5. [Logout](#5-logout)
- **User** (4)
  6. [Update Profile](#6-update-profile)
  7. [Update Preferences (Theme)](#7-update-preferences-theme)
  8. [Clear Workspace](#8-clear-workspace)
  9. [Delete Account](#9-delete-account)
- **Folders** (4)
  10. [List Folders](#10-list-folders)
  11. [Create Folder](#11-create-folder)
  12. [Rename Folder](#12-rename-folder)
  13. [Delete Folder](#13-delete-folder)
- **Forms** (5)
  14. [List Forms](#14-list-forms)
  15. [Get Form By ID](#15-get-form-by-id)
  16. [Create Form](#16-create-form)
  17. [Update Form (Blocks/Name/Theme/Folder)](#17-update-form)
  18. [Delete Form](#18-delete-form)
- **Submissions (owner view)** (2)
  19. [List Submissions](#19-list-submissions)
  20. [Delete Submission](#20-delete-submission)
- **Public (form fill)** (4)
  21. [Get Public Form](#21-get-public-form)
  22. [Increment View](#22-increment-view)
  23. [Increment Start](#23-increment-start)
  24. [Submit Form](#24-submit-form)
- **Health** (1)
  25. [Health Check](#25-health-check)

---

# 🔐 AUTH

## 1. Register

Create a new account.

**Endpoint:** `POST /api/auth/register`
**Auth:** ❌ None (public)

### Request

```json
{
  "username": "julfikar",
  "email": "julfikar@example.com",
  "password": "Secret123!"
}
```

### Success (201 Created)

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2YTUwOGUzNDYxMGRhYWJiMjU1NjZlMzMi...",
    "user": {
      "id": "6a508e34610daabb25566e33",
      "username": "julfikar",
      "email": "julfikar@example.com",
      "fullName": "julfikar",
      "role": "user",
      "preferences": {
        "themeId": "dark"
      }
    }
  },
  "message": "Account created successfully.",
  "errors": null
}
```

### Errors

**400 — Validation failed**
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed.",
  "errors": {
    "username": ["Username must be at least 3 characters."],
    "password": ["Password must be at least 8 characters long."]
  }
}
```

**409 — Email or username taken**
```json
{
  "success": false,
  "data": null,
  "message": "An account with this email already exists.",
  "errors": null
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"julfikar","email":"julfikar@example.com","password":"Secret123!"}'
```

---

## 2. Login

Authenticate an existing user.

**Endpoint:** `POST /api/auth/login`
**Auth:** ❌ None (public)

### Request

```json
{
  "email": "julfikar@example.com",
  "password": "Secret123!"
}
```

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "6a508e34610daabb25566e33",
      "username": "julfikar",
      "email": "julfikar@example.com",
      "fullName": "Julfikar Sk",
      "role": "user",
      "preferences": {
        "themeId": "dark"
      }
    }
  },
  "message": "Logged in successfully.",
  "errors": null
}
```

### Errors

**401 — Bad credentials**
```json
{
  "success": false,
  "data": null,
  "message": "Invalid email or password.",
  "errors": null
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"julfikar@example.com","password":"Secret123!"}'
```

---

## 3. Get Current User

Returns the logged-in user's data. Useful on page load to confirm the token is still valid.

**Endpoint:** `GET /api/auth/me`
**Auth:** ✅ Required

### Request

No body. Just the Authorization header.

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "6a508e34610daabb25566e33",
    "username": "julfikar",
    "email": "julfikar@example.com",
    "fullName": "Julfikar Sk",
    "role": "user",
    "preferences": {
      "themeId": "dark"
    }
  },
  "message": null,
  "errors": null
}
```

### Errors

**401 — No token / expired token**
```json
{
  "success": false,
  "data": null,
  "message": "You must be logged in to perform this action.",
  "errors": null
}
```

### cURL

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer eyJhbGci..."
```

---

## 4. Change Password

Change the current user's password. Requires the current password.

**Endpoint:** `POST /api/auth/change-password`
**Auth:** ✅ Required

### Request

```json
{
  "currentPassword": "Secret123!",
  "newPassword": "NewSecret456!"
}
```

### Success (200 OK)

```json
{
  "success": true,
  "message": "Password changed successfully.",
  "errors": null
}
```

### Errors

**400 — Current password wrong**
```json
{
  "success": false,
  "message": "Current password is incorrect.",
  "errors": null
}
```

**400 — New too short / same as old**
```json
{
  "success": false,
  "message": "New password must be different from the current one.",
  "errors": null
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"Secret123!","newPassword":"NewSecret456!"}'
```

---

## 5. Logout

Server-side confirmation of logout (client just deletes the token from localStorage).

**Endpoint:** `POST /api/auth/logout`
**Auth:** ✅ Required

### Request
No body.

### Success (200 OK)

```json
{
  "success": true,
  "message": "Logged out successfully.",
  "errors": null
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/auth/logout \
  -H "Authorization: Bearer eyJ..."
```

---

# 👤 USER

## 6. Update Profile

Update the display name and/or email.

**Endpoint:** `PUT /api/users/me`
**Auth:** ✅ Required

### Request (both fields optional — send only what changes)

```json
{
  "fullName": "Julfikar Sk",
  "email": "julfikar.new@example.com"
}
```

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "6a508e34610daabb25566e33",
    "username": "julfikar",
    "email": "julfikar.new@example.com",
    "fullName": "Julfikar Sk",
    "role": "user",
    "preferences": { "themeId": "dark" }
  },
  "message": "Profile updated successfully.",
  "errors": null
}
```

### Errors

**409 — New email is taken**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "email": ["An account with this email already exists."]
  }
}
```

### cURL

```bash
curl -X PUT http://localhost:5000/api/users/me \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Julfikar Sk","email":"julfikar.new@example.com"}'
```

---

## 7. Update Preferences (Theme)

Change the user's global theme.

**Endpoint:** `PUT /api/users/me/preferences`
**Auth:** ✅ Required

### Request

```json
{ "themeId": "dark" }
```

Valid values: `"light"`, `"dark"`, `"tail-blue"`.

### Success (200 OK)

```json
{
  "success": true,
  "data": { "themeId": "dark" },
  "message": "Preferences updated successfully.",
  "errors": null
}
```

### Errors

**400 — Invalid theme**
```json
{
  "success": false,
  "message": "Invalid theme ID.",
  "errors": null
}
```

### cURL

```bash
curl -X PUT http://localhost:5000/api/users/me/preferences \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"themeId":"tail-blue"}'
```

---

## 8. Clear Workspace

Delete all folders + forms + submissions. **Keeps the account.**

**Endpoint:** `DELETE /api/users/me/workspace`
**Auth:** ✅ Required

### Request
No body.

### Success (200 OK)

```json
{
  "success": true,
  "message": "All folders and forms cleared.",
  "errors": null
}
```

### cURL

```bash
curl -X DELETE http://localhost:5000/api/users/me/workspace \
  -H "Authorization: Bearer eyJ..."
```

---

## 9. Delete Account

Permanently delete the user's account and all data.

**Endpoint:** `DELETE /api/users/me`
**Auth:** ✅ Required

### Request
No body.

### Success (200 OK)

```json
{
  "success": true,
  "message": "Account deleted successfully.",
  "errors": null
}
```

⚠️ After this call, the JWT is orphaned — subsequent requests return `401`.

### cURL

```bash
curl -X DELETE http://localhost:5000/api/users/me \
  -H "Authorization: Bearer eyJ..."
```

---

# 📁 FOLDERS

## 10. List Folders

Get all folders for the current user.

**Endpoint:** `GET /api/folders`
**Auth:** ✅ Required

### Request
No body.

### Success (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "6a508e34610daabb25566e40",
      "name": "Computer Networks",
      "userId": "6a508e34610daabb25566e33",
      "createdAt": "2026-01-15T10:00:00.000Z"
    },
    {
      "id": "6a508e34610daabb25566e41",
      "name": "HR Forms",
      "userId": "6a508e34610daabb25566e33",
      "createdAt": "2026-02-20T12:30:00.000Z"
    }
  ],
  "message": null,
  "errors": null
}
```

If empty: `"data": []`.

### cURL

```bash
curl http://localhost:5000/api/folders \
  -H "Authorization: Bearer eyJ..."
```

---

## 11. Create Folder

**Endpoint:** `POST /api/folders`
**Auth:** ✅ Required

### Request

```json
{ "name": "Marketing" }
```

### Success (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "6a508e34610daabb25566e42",
    "name": "Marketing",
    "userId": "6a508e34610daabb25566e33",
    "createdAt": "2026-07-10T18:00:00.000Z"
  },
  "message": "Folder created successfully.",
  "errors": null
}
```

### Errors

**400 — Empty name**
```json
{
  "success": false,
  "message": "Folder name is required.",
  "errors": null
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/folders \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"name":"Marketing"}'
```

---

## 12. Rename Folder

**Endpoint:** `PUT /api/folders/{id}`
**Auth:** ✅ Required

### Request

```json
{ "name": "Marketing Q3 2026" }
```

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "6a508e34610daabb25566e42",
    "name": "Marketing Q3 2026",
    "userId": "6a508e34610daabb25566e33",
    "createdAt": "2026-07-10T18:00:00.000Z"
  },
  "message": "Folder renamed successfully.",
  "errors": null
}
```

### Errors

**404 — Not found or not owned**
```json
{
  "success": false,
  "message": "Folder not found.",
  "errors": null
}
```

### cURL

```bash
curl -X PUT http://localhost:5000/api/folders/6a508e34610daabb25566e42 \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"name":"Marketing Q3 2026"}'
```

---

## 13. Delete Folder

Cascade: also deletes all forms inside + their submissions.

**Endpoint:** `DELETE /api/folders/{id}`
**Auth:** ✅ Required

### Success (200 OK)

```json
{
  "success": true,
  "message": "Folder deleted successfully.",
  "errors": null
}
```

### cURL

```bash
curl -X DELETE http://localhost:5000/api/folders/6a508e34610daabb25566e42 \
  -H "Authorization: Bearer eyJ..."
```

---

# 📝 FORMS

## 14. List Forms

Get the current user's forms. Optional folder filter.

**Endpoint:** `GET /api/forms`
**Auth:** ✅ Required

### Query Params

| Param | Purpose |
|-------|---------|
| `folderId` (optional) | Filter to a specific folder ID. If omitted, returns all forms (across all folders + root). |

### Request Examples
```
GET /api/forms
GET /api/forms?folderId=6a508e34610daabb25566e42
```

### Success (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "6a508e34610daabb25566e50",
      "name": "Customer Feedback",
      "folderId": null,
      "themeId": "light",
      "views": 42,
      "submissionCount": 8,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-07-01T14:20:00.000Z"
    },
    {
      "id": "6a508e34610daabb25566e51",
      "name": "Job Application",
      "folderId": "6a508e34610daabb25566e42",
      "themeId": "dark",
      "views": 15,
      "submissionCount": 3,
      "createdAt": "2026-06-01T09:15:00.000Z",
      "updatedAt": "2026-07-05T11:30:00.000Z"
    }
  ],
  "message": null,
  "errors": null
}
```

**Note:** This "list" version doesn't include `blocks` — for performance. Use `GET /api/forms/{id}` to get the full form.

### cURL

```bash
curl "http://localhost:5000/api/forms?folderId=6a508e34610daabb25566e42" \
  -H "Authorization: Bearer eyJ..."
```

---

## 15. Get Form By ID

Get one form with its full blocks array. Used by the Form Builder page.

**Endpoint:** `GET /api/forms/{id}`
**Auth:** ✅ Required (must be the owner)

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "6a508e34610daabb25566e50",
    "name": "Customer Feedback",
    "folderId": null,
    "themeId": "light",
    "blocks": [
      {
        "id": "b1",
        "type": "text-bubble",
        "data": { "content": "Hi there! What's your name?" }
      },
      {
        "id": "b2",
        "type": "text-input",
        "data": {
          "label": "Your name",
          "placeholder": "Type your name here...",
          "required": true
        }
      },
      {
        "id": "b3",
        "type": "email-input",
        "data": {
          "label": "Email",
          "placeholder": "you@example.com",
          "required": true
        }
      },
      {
        "id": "b4",
        "type": "rating-input",
        "data": {
          "label": "Rate our service",
          "max": 5,
          "required": true
        }
      }
    ],
    "views": 42,
    "starts": 15,
    "submissionCount": 8,
    "createdAt": "2026-01-15T10:00:00.000Z",
    "updatedAt": "2026-07-01T14:20:00.000Z"
  },
  "message": null,
  "errors": null
}
```

### Errors

**404 — Form not found or not owned**
```json
{
  "success": false,
  "message": "Form not found.",
  "errors": null
}
```

### cURL

```bash
curl http://localhost:5000/api/forms/6a508e34610daabb25566e50 \
  -H "Authorization: Bearer eyJ..."
```

---

## 16. Create Form

Create an empty form (no blocks yet).

**Endpoint:** `POST /api/forms`
**Auth:** ✅ Required

### Request

```json
{
  "name": "Customer Feedback",
  "folderId": null
}
```

Or to put it in a folder:
```json
{
  "name": "Job Application",
  "folderId": "6a508e34610daabb25566e42"
}
```

### Success (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "6a508e34610daabb25566e52",
    "name": "Customer Feedback",
    "folderId": null,
    "themeId": "light",
    "blocks": [],
    "views": 0,
    "starts": 0,
    "submissionCount": 0,
    "createdAt": "2026-07-10T18:30:00.000Z",
    "updatedAt": "2026-07-10T18:30:00.000Z"
  },
  "message": "Form created successfully.",
  "errors": null
}
```

### Errors

**400 — Missing name**
```json
{
  "success": false,
  "message": "Form name is required.",
  "errors": null
}
```

**404 — Folder doesn't exist / not owned**
```json
{
  "success": false,
  "message": "Folder not found.",
  "errors": null
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/forms \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{"name":"Customer Feedback","folderId":null}'
```

---

## 17. Update Form

Update any subset: name, folder, theme, blocks. Only provided fields change.

**Endpoint:** `PUT /api/forms/{id}`
**Auth:** ✅ Required (owner)

### Request examples

**Rename only:**
```json
{ "name": "Customer Feedback v2" }
```

**Move to a folder:**
```json
{ "folderId": "6a508e34610daabb25566e42" }
```

**Move to root (out of any folder):**
```json
{ "folderId": "" }
```

**Set theme:**
```json
{ "themeId": "dark" }
```

**Replace blocks (full array):**
```json
{
  "blocks": [
    {
      "id": "b1",
      "type": "text-bubble",
      "data": { "content": "Welcome! Please tell us about yourself." }
    },
    {
      "id": "b2",
      "type": "email-input",
      "data": {
        "label": "Your email",
        "placeholder": "you@example.com",
        "required": true
      }
    },
    {
      "id": "b3",
      "type": "buttons-input",
      "data": {
        "label": "Are you interested?",
        "options": ["Yes", "Maybe", "No"],
        "required": true
      }
    }
  ]
}
```

**Update everything at once:**
```json
{
  "name": "Customer Feedback v2",
  "folderId": "6a508e34610daabb25566e42",
  "themeId": "dark",
  "blocks": [...]
}
```

### Block `data` field shapes

Each block type has a specific `data` shape:

| Block type | `data` fields |
|------------|---------------|
| `text-bubble` | `{ "content": "string" }` |
| `image-bubble`, `video-bubble`, `gif-bubble` | `{ "url": "https://..." }` |
| `text-input`, `number-input`, `email-input`, `phone-input` | `{ "label": "string", "placeholder": "string", "required": true/false }` |
| `date-input` | `{ "label": "string", "required": true/false }` |
| `rating-input` | `{ "label": "string", "max": 5, "required": true/false }` |
| `buttons-input` | `{ "label": "string", "options": ["A", "B", ...], "required": true/false }` |

### Success (200 OK)

Returns the updated form (same shape as `GET /api/forms/{id}`).

### Errors

**400 — Invalid block type**
```json
{
  "success": false,
  "message": "One or more blocks have an invalid type.",
  "errors": null
}
```

**400 — Invalid theme**
```json
{
  "success": false,
  "message": "Invalid theme ID.",
  "errors": null
}
```

**404 — Form not found**
```json
{
  "success": false,
  "message": "Form not found.",
  "errors": null
}
```

### cURL

```bash
curl -X PUT http://localhost:5000/api/forms/6a508e34610daabb25566e50 \
  -H "Authorization: Bearer eyJ..." \
  -H "Content-Type: application/json" \
  -d '{
    "blocks": [
      { "id": "b1", "type": "text-bubble", "data": { "content": "Hi!" } },
      { "id": "b2", "type": "email-input", "data": { "label": "Email", "required": true } }
    ]
  }'
```

---

## 18. Delete Form

Cascade: also deletes all submissions.

**Endpoint:** `DELETE /api/forms/{id}`
**Auth:** ✅ Required (owner)

### Success (200 OK)

```json
{
  "success": true,
  "message": "Form deleted successfully.",
  "errors": null
}
```

### cURL

```bash
curl -X DELETE http://localhost:5000/api/forms/6a508e34610daabb25566e50 \
  -H "Authorization: Bearer eyJ..."
```

---

# 📊 SUBMISSIONS (owner view)

## 19. List Submissions

Get all responses for a form + aggregate stats.

**Endpoint:** `GET /api/forms/{id}/submissions`
**Auth:** ✅ Required (owner of the form)

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "form": {
      "id": "6a508e34610daabb25566e50",
      "views": 42,
      "starts": 15,
      "submissionCount": 3
    },
    "submissions": [
      {
        "id": "6a508e34610daabb25566e60",
        "submittedAt": "2026-07-07T14:23:00.000Z",
        "values": {
          "b2": "John Doe",
          "b3": "john@example.com",
          "b4": 5
        }
      },
      {
        "id": "6a508e34610daabb25566e61",
        "submittedAt": "2026-07-07T14:31:00.000Z",
        "values": {
          "b2": "Jane Smith",
          "b3": "jane@example.com",
          "b4": 4
        }
      },
      {
        "id": "6a508e34610daabb25566e62",
        "submittedAt": "2026-07-08T10:15:00.000Z",
        "values": {
          "b2": "Bob Wilson",
          "b3": "bob@example.com",
          "b4": 3
        }
      }
    ]
  },
  "message": null,
  "errors": null
}
```

**Compute completion rate on the client:**
```
completionRate = (submissionCount / starts) × 100
```

**`values`** — a dict where keys are block IDs and values are the visitor's answers. Empty for skipped optional fields.

### Errors

**404 — Form not found**
```json
{
  "success": false,
  "message": "Form not found.",
  "errors": null
}
```

### cURL

```bash
curl http://localhost:5000/api/forms/6a508e34610daabb25566e50/submissions \
  -H "Authorization: Bearer eyJ..."
```

---

## 20. Delete Submission

Delete a single response.

**Endpoint:** `DELETE /api/forms/{formId}/submissions/{submissionId}`
**Auth:** ✅ Required (owner of the form)

### Success (200 OK)

```json
{
  "success": true,
  "message": "Response deleted successfully.",
  "errors": null
}
```

Also decrements `submissionCount` on the parent form.

### Errors

**404 — Submission not found or not owned**
```json
{
  "success": false,
  "message": "Submission not found.",
  "errors": null
}
```

### cURL

```bash
curl -X DELETE http://localhost:5000/api/forms/6a508e34610daabb25566e50/submissions/6a508e34610daabb25566e60 \
  -H "Authorization: Bearer eyJ..."
```

---

# 🌍 PUBLIC (form fill — no auth)

These endpoints power the `/f/:formId` chat interface visitors use. **No JWT needed.**

## 21. Get Public Form

Get the safe subset of a form for public rendering.

**Endpoint:** `GET /api/public/forms/{id}`
**Auth:** ❌ None

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "id": "6a508e34610daabb25566e50",
    "name": "Customer Feedback",
    "themeId": "light",
    "blocks": [
      {
        "id": "b1",
        "type": "text-bubble",
        "data": { "content": "Hi there!" }
      },
      {
        "id": "b2",
        "type": "email-input",
        "data": {
          "label": "Your email",
          "placeholder": "you@example.com",
          "required": true
        }
      }
    ]
  },
  "message": null,
  "errors": null
}
```

Note: this response **excludes** `views`, `starts`, `submissionCount`, `userId`, `folderId` — those are private.

### Errors

**404 — Form doesn't exist**
```json
{
  "success": false,
  "message": "Form not found.",
  "errors": null
}
```

### cURL

```bash
curl http://localhost:5000/api/public/forms/6a508e34610daabb25566e50
```

---

## 22. Increment View

Called by the public form page on load. Tracks how many people opened the link.

**Endpoint:** `POST /api/public/forms/{id}/view`
**Auth:** ❌ None

### Request
No body.

### Success (204 No Content)

No response body. Backend increments `form.views`.

### cURL

```bash
curl -X POST http://localhost:5000/api/public/forms/6a508e34610daabb25566e50/view
```

---

## 23. Increment Start

*(Optional)* Called when the visitor answers the first input. Tracks abandonment.

**Endpoint:** `POST /api/public/forms/{id}/start`
**Auth:** ❌ None

### Request
No body.

### Success (204 No Content)

Backend increments `form.starts`.

### cURL

```bash
curl -X POST http://localhost:5000/api/public/forms/6a508e34610daabb25566e50/start
```

---

## 24. Submit Form

Save a completed submission.

**Endpoint:** `POST /api/public/forms/{id}/submissions`
**Auth:** ❌ None

### Request

```json
{
  "values": {
    "b2": "John Doe",
    "b3": "john@example.com",
    "b4": 5,
    "b5": "I love the product!"
  }
}
```

Keys are block IDs. Values are what the visitor typed/selected. Empty entries can be omitted.

### Rules
- Every input block marked `required: true` must have a value.
- Email inputs must contain a valid email.
- Number inputs must be numeric.
- Rating inputs must be between 1 and the block's `max`.

### Success (201 Created)

```json
{
  "success": true,
  "data": {
    "id": "6a508e34610daabb25566e70",
    "submittedAt": "2026-07-10T18:45:00.000Z",
    "values": {
      "b2": "John Doe",
      "b3": "john@example.com",
      "b4": 5,
      "b5": "I love the product!"
    }
  },
  "message": "Response submitted successfully.",
  "errors": null
}
```

### Errors

**400 — Missing required field(s)**
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed.",
  "errors": {
    "b3": ["Required field"]
  }
}
```

**400 — Invalid email**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "b3": ["Enter a valid email address."]
  }
}
```

**400 — Rating out of range**
```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": {
    "b4": ["Rating must be between 1 and 5."]
  }
}
```

**404 — Form deleted**
```json
{
  "success": false,
  "message": "Form not found.",
  "errors": null
}
```

### cURL

```bash
curl -X POST http://localhost:5000/api/public/forms/6a508e34610daabb25566e50/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "values": {
      "b2": "John Doe",
      "b3": "john@example.com",
      "b4": 5,
      "b5": "I love the product!"
    }
  }'
```

---

# ❤️ HEALTH

## 25. Health Check

Verify the API is alive.

**Endpoint:** `GET /health`
**Auth:** ❌ None

### Success (200 OK)

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "service": "FormBuilder.API",
    "time": "2026-07-10T18:30:00.000Z"
  },
  "message": null,
  "errors": null
}
```

### cURL

```bash
curl http://localhost:5000/health
```

---

# 📋 Full End-to-End Test (using cURL)

Copy-paste the entire block to Bash / Git Bash / WSL:

```bash
BASE=http://localhost:5000/api

# 1. Register
REG=$(curl -s -X POST "$BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"e2e_user","email":"e2e@test.com","password":"Test1234!"}')
echo "Register: $REG"
TOKEN=$(echo "$REG" | grep -oP '"token":"[^"]+"' | cut -d'"' -f4)
echo "Token: $TOKEN"

# 2. Get me
curl -s "$BASE/auth/me" -H "Authorization: Bearer $TOKEN" | head -c 300
echo ""

# 3. Create a folder
FOLDER=$(curl -s -X POST "$BASE/folders" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Demo"}')
FOLDER_ID=$(echo "$FOLDER" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
echo "Folder: $FOLDER_ID"

# 4. Create a form
FORM=$(curl -s -X POST "$BASE/forms" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test Form\",\"folderId\":\"$FOLDER_ID\"}")
FORM_ID=$(echo "$FORM" | grep -oP '"id":"[^"]+"' | head -1 | cut -d'"' -f4)
echo "Form: $FORM_ID"

# 5. Add blocks
curl -s -X PUT "$BASE/forms/$FORM_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "blocks": [
      {"id":"b1","type":"text-bubble","data":{"content":"Hello!"}},
      {"id":"b2","type":"email-input","data":{"label":"Email","required":true}}
    ]
  }' | head -c 200
echo ""

# 6. Public — get the form
curl -s "$BASE/public/forms/$FORM_ID" | head -c 200
echo ""

# 7. Public — submit a response
curl -s -X POST "$BASE/public/forms/$FORM_ID/submissions" \
  -H "Content-Type: application/json" \
  -d '{"values":{"b2":"visitor@example.com"}}'
echo ""

# 8. Owner — view submissions
curl -s "$BASE/forms/$FORM_ID/submissions" \
  -H "Authorization: Bearer $TOKEN" | head -c 500
echo ""

# 9. Clean up
curl -s -X DELETE "$BASE/users/me" -H "Authorization: Bearer $TOKEN"
echo ""
```

Run it top-to-bottom and you'll see the full flow in action.

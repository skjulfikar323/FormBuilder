# Data Models (MongoDB)

The Form Builder uses **4 MongoDB collections**. This doc shows the schema for each, indexes to create, and relationships.

---

## Collection: `users`

Each document = one registered user.

```json
{
  "_id": ObjectId("651a7b3c9f1a2b3c4d5e6f70"),
  "username": "julfikar",
  "email": "julfikar@example.com",
  "passwordHash": "$2a$12$...",
  "fullName": "Julfikar Sk",
  "role": "user",
  "preferences": {
    "themeId": "dark"
  },
  "createdAt": ISODate("2026-01-15T10:00:00Z"),
  "updatedAt": ISODate("2026-07-07T18:30:00Z")
}
```

### Field reference

Field | Type | Required | Notes
---|---|---|---
`_id` | ObjectId | ✅ | Auto-generated Mongo ObjectId
`username` | string | ✅ | Unique. 3–30 chars. `[a-zA-Z0-9_.-]`
`email` | string | ✅ | Unique. Lowercase.
`passwordHash` | string | ✅ | BCrypt hash. NEVER return this to the frontend.
`fullName` | string | ✅ | User's display name. Defaults to `username` on register.
`role` | string | ✅ | `"user"` or `"admin"` (for later)
`preferences.themeId` | string | ❌ | One of `"light"`, `"dark"`, `"tail-blue"`. Default `"dark"`.
`createdAt` | Date | ✅ | ISO date
`updatedAt` | Date | ✅ | ISO date

### Indexes

```javascript
db.users.createIndex({ email: 1 }, { unique: true })
db.users.createIndex({ username: 1 }, { unique: true })
```

---

## Collection: `folders`

Each document = one folder created by a user.

```json
{
  "_id": ObjectId("651a7b3c9f1a2b3c4d5e6f71"),
  "userId": ObjectId("651a7b3c9f1a2b3c4d5e6f70"),
  "name": "Computer Networks",
  "createdAt": ISODate("2026-01-16T09:00:00Z"),
  "updatedAt": ISODate("2026-01-16T09:00:00Z")
}
```

### Field reference

Field | Type | Required | Notes
---|---|---|---
`_id` | ObjectId | ✅ |
`userId` | ObjectId | ✅ | Foreign key → `users._id`
`name` | string | ✅ | 1-100 chars
`createdAt` | Date | ✅ |
`updatedAt` | Date | ✅ |

### Indexes

```javascript
db.folders.createIndex({ userId: 1, createdAt: -1 })
```

Lets you quickly list a user's folders sorted by newest first.

---

## Collection: `forms`

Each document = one form (a.k.a. "typebot").

**Note**: blocks are stored **inline** (embedded), not as a separate collection. This is intentional — blocks always load together with the form, and MongoDB is happy with documents up to 16 MB (way more than any form will ever need).

```json
{
  "_id": ObjectId("651a7b3c9f1a2b3c4d5e6f72"),
  "userId": ObjectId("651a7b3c9f1a2b3c4d5e6f70"),
  "folderId": ObjectId("651a7b3c9f1a2b3c4d5e6f71"),
  "name": "Customer Feedback",
  "themeId": "light",
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
  "createdAt": ISODate("2026-02-20T12:00:00Z"),
  "updatedAt": ISODate("2026-07-01T14:20:00Z")
}
```

### Field reference

Field | Type | Required | Notes
---|---|---|---
`_id` | ObjectId | ✅ |
`userId` | ObjectId | ✅ | Owner of the form
`folderId` | ObjectId \| null | ❌ | `null` = root level (not inside a folder)
`name` | string | ✅ | 1-200 chars
`themeId` | string | ❌ | Optional per-form theme override. Default: use user's global preference.
`blocks` | array | ✅ | Ordered list of blocks (see below)
`views` | number | ✅ | Public form loads. Starts at 0.
`starts` | number | ✅ | Users who answered at least one input. Starts at 0.
`submissionCount` | number | ✅ | Denormalized count = `submissions` where `formId = this._id`. Kept in sync on each submission add/delete.
`createdAt` | Date | ✅ |
`updatedAt` | Date | ✅ | Updated whenever `blocks`, `name`, or `folderId` change

### Block structure (inside `blocks[]`)

Every block has 3 fields:
```
{ id, type, data }
```

- `id`: string (e.g. `"b1"`) — unique within the form. Frontend generates it (`Date.now()-counter` in current impl).
- `type`: one of the 11 valid types (see `02_API_REFERENCE.md#valid-block-types`).
- `data`: object with type-specific fields.

### Block `data` schemas by type

```javascript
// text-bubble
{ content: string }

// image-bubble / video-bubble / gif-bubble
{ url: string }

// text-input / number-input / email-input / phone-input
{ label: string, placeholder?: string, required: boolean }

// date-input
{ label: string, required: boolean }

// rating-input
{ label: string, max: number (1-10, default 5), required: boolean }

// buttons-input
{ label: string, options: string[], required: boolean }
```

### Indexes

```javascript
db.forms.createIndex({ userId: 1, folderId: 1, createdAt: -1 })
db.forms.createIndex({ userId: 1, updatedAt: -1 })
```

The first index lets `GET /api/forms?folderId=xxx` run fast.
The second helps sort a user's forms by "most recently updated".

---

## Collection: `submissions`

Each document = one form response.

```json
{
  "_id": ObjectId("651a7b3c9f1a2b3c4d5e6f73"),
  "formId": ObjectId("651a7b3c9f1a2b3c4d5e6f72"),
  "values": {
    "b2": "user@example.com",
    "b3": 5
  },
  "submittedAt": ISODate("2026-07-07T14:23:00Z"),
  "ipAddress": "192.168.1.100",
  "userAgent": "Mozilla/5.0 ..."
}
```

### Field reference

Field | Type | Required | Notes
---|---|---|---
`_id` | ObjectId | ✅ |
`formId` | ObjectId | ✅ | Foreign key → `forms._id`
`values` | object | ✅ | Key = block ID, value = the answer
`submittedAt` | Date | ✅ |
`ipAddress` | string | ❌ | For abuse detection / analytics
`userAgent` | string | ❌ | For analytics

### Indexes

```javascript
db.submissions.createIndex({ formId: 1, submittedAt: -1 })
db.submissions.createIndex({ submittedAt: -1 })
```

First: for the owner's Response tab (list submissions for their form).
Second: for global cleanup queries (e.g., delete submissions older than X).

---

## Relationships

```
┌─────────────┐
│    users    │  (1)
│  _id (PK)   │
│  email      │
│  username   │
│  ...        │
└──────┬──────┘
       │ owns
       │
   ┌───┴───────────────────┬─────────────────────┐
   │                       │                     │
   ▼ (N)                   ▼ (N)                 │
┌──────────┐          ┌──────────┐               │
│ folders  │ (1)      │  forms   │               │
│ userId   │──── has ─│ folderId │               │
│ name     │   many   │ userId   │◄──────────────┘
└──────────┘          │ blocks[] │  (inline embedded)
                      │  ...     │
                      └────┬─────┘
                           │ owns
                           │ (N)
                           ▼
                    ┌─────────────┐
                    │ submissions │
                    │  formId     │
                    │  values{}   │
                    │  ...        │
                    └─────────────┘
```

## Cascading deletes

When you delete X, delete these too:

| Delete | Cascades to |
|--------|-------------|
| A **user** | All their folders + forms + submissions |
| A **folder** | All forms inside it + their submissions |
| A **form** | All its submissions |
| A **submission** | (leaf — nothing) |

Implementation: use a transaction (MongoDB 4.0+) or accept that a failed cascade leaves orphans and add a cleanup job.

## Denormalized counters

`forms.views`, `forms.starts`, `forms.submissionCount` are denormalized for performance. Keep them in sync:

- On `POST /api/public/forms/:id/view` → `$inc: { views: 1 }`
- On `POST /api/public/forms/:id/start` → `$inc: { starts: 1 }`
- On `POST /api/public/forms/:id/submissions` → `$inc: { submissionCount: 1 }` (and `starts` if not already incremented)
- On `DELETE /api/forms/:id/submissions/:subId` → `$inc: { submissionCount: -1 }`

Use MongoDB's atomic `$inc` operator so concurrent submits don't lose counts.

## MongoDB local setup (quick)

```bash
# Install via winget on Windows
winget install MongoDB.Server

# Or use Docker
docker run -d -p 27017:27017 --name mongo mongo:latest

# Or use MongoDB Atlas (free tier)
# https://cloud.mongodb.com/
```

**Connection string** in `appsettings.Development.json`:
```json
{
  "MongoDb": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "formbuilder_dev"
  }
}
```

**Create the indexes on startup** (in `Program.cs` or a startup task):
```csharp
await usersCollection.Indexes.CreateManyAsync(new[] {
    new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.Email),
        new CreateIndexOptions { Unique = true }),
    new CreateIndexModel<User>(Builders<User>.IndexKeys.Ascending(u => u.Username),
        new CreateIndexOptions { Unique = true }),
});
```

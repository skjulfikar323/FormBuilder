# FormBuilder

Full-stack Form Builder — visual drag-drop form designer with a chat-style public form fill experience.

## Repository Layout

```
FormBuilder/
├── FormBuilder.UI/                React + Vite frontend  (already built)
├── FormBuilder.API/               ASP.NET Core Web API entry point
├── FormBuilder.Core/              DTOs, Models, Enums, Constants
├── FormBuilder.Data/              MongoDB context + repositories
├── FormBuilder.Service/           Business logic + JWT + AutoMapper
├── FormBuilder.Utilities/         Logger, extensions, password hashing
├── FormBuilder.Message/           Standard ApiResponse wrapper + message constants
├── FormBuilder.UnitTests/         xUnit + Moq + FluentAssertions
├── FormBuilder.sln                Solution file
├── docs/                          API documentation
└── design/                        Figma SVG exports
```

## Backend Quick Start

### 1. Prerequisites
- .NET 9 SDK — verify with `dotnet --version`
- MongoDB running locally on `mongodb://localhost:27017` (Docker: `docker run -d -p 27017:27017 --name mongo mongo:latest`)

### 2. Restore + build
```powershell
cd D:\Julfikar\Projects\FormBuilder
dotnet restore
dotnet build
```

### 3. Run
```powershell
dotnet run --project FormBuilder.API
```

### 4. Open Swagger
Browser: **http://localhost:5000/swagger**

Test the register endpoint from Swagger, then use the returned JWT to authorize other endpoints.

### 5. Configure
Edit `FormBuilder.API/appsettings.Development.json`:
- `MongoDb.ConnectionString` — your MongoDB connection string
- `Jwt.Secret` — change to a strong random 32+ char string

### 6. Tests
```powershell
dotnet test
```

## Frontend Quick Start

```powershell
cd D:\Julfikar\Projects\FormBuilder\FormBuilder.UI
npm install
npm run dev
```

Opens on `http://localhost:5173+`.

## Documentation

Full API + data model docs live in `docs/`:

- `docs/README.md` — start here
- `docs/01_WORKFLOW.md` — user journey with API calls
- `docs/02_API_REFERENCE.md` — every endpoint
- `docs/03_DATA_MODELS.md` — MongoDB schemas
- `docs/04_AUTH_FLOW.md` — JWT explained
- `docs/05_UI_TO_API_MAP.md` — cheat sheet

## Backend Layer Dependencies

```
     FormBuilder.API
           │
           ▼
   FormBuilder.Service
           │
           ▼
    FormBuilder.Data
           │
           ▼
    FormBuilder.Core   ◄──── referenced by everyone

  Also referenced by all:
  - FormBuilder.Utilities
  - FormBuilder.Message
```

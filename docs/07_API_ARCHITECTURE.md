# API Technical Documentation — FormBuilder.API

Complete architecture of the ASP.NET Core 9 backend. Build reference — explains how the code is organized, why each layer exists, and how a request flows through it.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Solution Structure](#solution-structure)
4. [Dependency Flow](#dependency-flow)
5. [Data Models](#data-models)
6. [Request Lifecycle](#request-lifecycle)
7. [Configuration](#configuration)
8. [Authentication & Authorization](#authentication--authorization)
9. [Repository Pattern](#repository-pattern)
10. [Service Layer & Response Envelope](#service-layer--response-envelope)
11. [Controllers](#controllers)
12. [Middleware Pipeline](#middleware-pipeline)
13. [Logging (Serilog)](#logging-serilog)
14. [Error Handling](#error-handling)
15. [MongoDB Integration](#mongodb-integration)
16. [Testing Strategy](#testing-strategy)
17. [Running & Debugging](#running--debugging)
18. [Adding a New Endpoint](#adding-a-new-endpoint)
19. [Deployment Considerations](#deployment-considerations)

---

## Overview

**FormBuilder.API** is a REST API backed by MongoDB Atlas, secured with JWT bearer authentication. It follows the classic **N-Tier (Layered) Architecture** pattern with 6 projects:

- `FormBuilder.API` — HTTP entry point (Controllers, middleware, `Program.cs`)
- `FormBuilder.Service` — Business logic
- `FormBuilder.Data` — MongoDB repositories
- `FormBuilder.Core` — Shared contracts (Models, DTOs, Enums, Constants)
- `FormBuilder.Utilities` — Cross-cutting helpers (logger, password hasher, extensions)
- `FormBuilder.Message` — Standard response envelope + message constants

Plus:
- `FormBuilder.UnitTests` — xUnit + Moq test project

---

## Tech Stack

| Concern | Library | Version |
|---------|---------|:---:|
| Runtime | **.NET** | 9 |
| Web framework | **ASP.NET Core** | 9 |
| API docs | **Swashbuckle (Swagger)** | 7.2 |
| Authentication | **`Microsoft.AspNetCore.Authentication.JwtBearer`** | 9.0 |
| JWT | **`System.IdentityModel.Tokens.Jwt`** | 8.0 |
| Password hashing | **`BCrypt.Net-Next`** | 4.0 |
| MongoDB | **`MongoDB.Driver`** (+ `MongoDB.Bson`) | 3.0 |
| Object mapping | **AutoMapper** | 13.0 |
| Validation | **FluentValidation** | 11 |
| Logging | **Serilog.AspNetCore** + Console + File sinks | 9.0 |
| Testing | **xUnit** + **Moq** + **FluentAssertions** | latest |

Full list per project: `*.csproj` files.

---

## Solution Structure

```
FormBuilder/
├── FormBuilder.sln
│
├── FormBuilder.API/                       Entry point (Web API)
│   ├── Controllers/
│   │   ├── AuthController.cs              register, login, me, change-password, logout
│   │   ├── UsersController.cs             me PUT, preferences, workspace clear, delete
│   │   ├── FoldersController.cs           CRUD
│   │   ├── FormsController.cs             CRUD + submissions nested
│   │   ├── PublicFormsController.cs       Anonymous form fill
│   │   └── HealthController.cs            GET /health
│   ├── Middleware/
│   │   └── ExceptionHandlingMiddleware.cs Catches unhandled exceptions
│   ├── Helper/
│   │   └── ControllerExtensions.cs        HttpContext.GetCurrentUserId()
│   ├── Program.cs                          Startup, DI, pipeline
│   ├── appsettings.json                    Base config
│   ├── appsettings.Development.json        Dev overrides (checked in)
│   └── logs/                                Serilog output (git-ignored)
│
├── FormBuilder.Service/                   Business logic
│   ├── Interface/
│   │   ├── IAuthService.cs
│   │   ├── IUserService.cs
│   │   ├── IFolderService.cs
│   │   ├── IFormService.cs
│   │   ├── ISubmissionService.cs
│   │   ├── IPublicFormService.cs
│   │   └── IJwtService.cs
│   ├── Implement/                          (one class per interface)
│   ├── Config/
│   │   ├── JwtSettings.cs                  (Options pattern)
│   │   └── CorsSettings.cs
│   ├── Mappings/
│   │   ├── AuthMappingProfile.cs
│   │   ├── FolderMappingProfile.cs
│   │   └── FormMappingProfile.cs
│   └── DependencyInjection.cs              services.AddServiceLayer()
│
├── FormBuilder.Data/                       MongoDB repositories
│   ├── Interface/                          (I*Repository per collection)
│   ├── Implement/                          (implementations using AppDbContext)
│   ├── AppDbContext.cs                     Wraps IMongoDatabase, exposes collections
│   ├── DependencyInjection.cs              services.AddDataLayer()
│   └── Helper/
│       └── MongoIndexHelper.cs             Creates indexes on startup
│
├── FormBuilder.Core/                       Contracts (no dependencies except Bson)
│   ├── Models/                             MongoDB entities (User, Folder, Form, Block, Submission)
│   ├── DTOs/                               Request/response shapes
│   │   ├── Auth/     Login, Register, ChangePassword, AuthResponse
│   │   ├── User/     UserResponse, UpdateProfileRequest, UserPreferences
│   │   ├── Folder/   FolderResponse, Create/Rename requests
│   │   ├── Form/     FormResponse, FormListItem, Create/Update, PublicForm, Block
│   │   └── Submission/  SubmissionRequest, Response, list wrapper
│   ├── Enums/
│   │   ├── BlockType.cs
│   │   └── UserRole.cs
│   ├── Constants/
│   │   └── AppConstants.cs                 (Theme IDs, BlockType strings, collection names)
│   └── Helper/
│
├── FormBuilder.Utilities/                  Cross-cutting
│   ├── AppLogger.cs                        Serilog wrapper
│   ├── Extended.cs                         IsValidEmail, ToSlug, IsValidObjectId, SafeTrim
│   ├── PasswordHasher.cs                   BCrypt.Hash / Verify
│   ├── BsonJsonExtensions.cs               JsonElement ↔ BsonDocument
│   └── Helper/
│
├── FormBuilder.Message/                    Standard responses
│   ├── ApiResponse.cs                      Generic { success, data, message, errors }
│   ├── ErrorMessages.cs                    String constants
│   ├── SuccessMessages.cs
│   └── ResponseCode.cs                     Enum
│
└── FormBuilder.UnitTests/                  xUnit + Moq
    └── Services/
        └── AuthServiceTests.cs             (register/login test examples)
```

---

## Dependency Flow

Strict directional rule — never reverse:

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

  Also referenced by all three:
    • FormBuilder.Utilities
    • FormBuilder.Message
```

**Rules:**
- **API** → Service, Core, Message, Utilities
- **Service** → Data, Core, Message, Utilities
- **Data** → Core, Utilities
- **Core, Utilities, Message** → nothing (leaf projects)

Never do: Data → Service, or Core → Data. If tempted, extract the shared contract into Core.

---

## Data Models

Five root entities, one embedded type.

### `User`

```csharp
public class User {
    public string Id { get; set; }             // ObjectId
    public string Username { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }   // BCrypt
    public string FullName { get; set; }
    public string Role { get; set; }           // "user" | "admin"
    public UserPreferences Preferences { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
public class UserPreferences {
    public string ThemeId { get; set; }        // "light" | "dark" | "tail-blue"
}
```

**Indexes:** unique on `email` and `username` (`MongoIndexHelper`).

### `Folder`

```csharp
public class Folder {
    public string Id { get; set; }
    public string UserId { get; set; }         // FK → User.Id
    public string Name { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### `Form`

```csharp
public class Form {
    public string Id { get; set; }
    public string UserId { get; set; }
    public string? FolderId { get; set; }      // null = root-level
    public string Name { get; set; }
    public string ThemeId { get; set; }        // per-form theme (nice-to-have)
    public List<Block> Blocks { get; set; }    // embedded
    public int Views { get; set; }
    public int Starts { get; set; }
    public int SubmissionCount { get; set; }   // denormalized counter
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
```

### `Block` (embedded)

```csharp
public class Block {
    public string Id { get; set; }             // "b1", "b2", ...
    public string Type { get; set; }           // one of 11 valid types
    public BsonDocument Data { get; set; }     // free-form per-type shape
}
```

`Data` is stored as `BsonDocument` because block shape varies (`{content}` for text-bubble, `{label, options}` for buttons-input, etc.). It's converted to/from `JsonElement` at the API boundary via `BsonJsonExtensions`.

### `Submission`

```csharp
public class Submission {
    public string Id { get; set; }
    public string FormId { get; set; }
    public BsonDocument Values { get; set; }    // { blockId: answer }
    public DateTime SubmittedAt { get; set; }
    public string? IpAddress { get; set; }
    public string? UserAgent { get; set; }
}
```

Full schema details: [`docs/03_DATA_MODELS.md`](./03_DATA_MODELS.md).

---

## Request Lifecycle

Follow a typical write endpoint — `POST /api/forms`:

```
1. Browser sends
   POST /api/forms
   Authorization: Bearer eyJ...
   { "name": "Feedback" }
                       │
                       ▼
2. ExceptionHandlingMiddleware wraps everything downstream in try/catch
                       │
                       ▼
3. SerilogRequestLogging logs "Request starting" with method/path
                       │
                       ▼
4. CORS check — is the Origin allowed? (from appsettings Cors:AllowedOrigins)
                       │
                       ▼
5. UseAuthentication — validates the JWT signature + expiry
   Populates HttpContext.User with claims
   (If invalid → 401 immediately)
                       │
                       ▼
6. UseAuthorization — [Authorize] on the controller class
   passes because User is authenticated
                       │
                       ▼
7. Routing matches: POST /api/forms → FormsController.Create()
                       │
                       ▼
8. Model binding: request body → CreateFormRequestDto
                       │
                       ▼
9. Controller extracts userId from claims:
       var userId = HttpContext.GetCurrentUserId();
                       │
                       ▼
10. Controller calls the service:
        var result = await _forms.CreateAsync(userId, dto);
                       │
                       ▼
11. FormService.CreateAsync:
    - validates name (must be non-empty, ≤ 200 chars)
    - if folderId provided, checks user owns that folder
    - constructs Form entity
    - calls _formRepo.InsertAsync(form)
                       │
                       ▼
12. FormRepository.InsertAsync:
        await _db.Forms.InsertOneAsync(form);       ← MongoDB
    (Mongo assigns form._id)
                       │
                       ▼
13. Service maps Form → FormResponseDto (AutoMapper) and wraps:
        return ApiResponse<FormResponseDto>.Ok(dto, SuccessMessages.FormCreated);
                       │
                       ▼
14. Controller returns 201 Created + JSON:
        {
          "success": true,
          "data": { "id": "...", "name": "Feedback", "blocks": [], ... },
          "message": "Form created successfully.",
          "errors": null
        }
                       │
                       ▼
15. SerilogRequestLogging logs "Request finished — 201 in 87ms"
                       │
                       ▼
16. Response goes to browser
```

Read endpoints skip step 11's write and go straight to a query in the repository. Cascade-delete endpoints (folder/form/account delete) run additional repository calls in service layer to remove related documents.

---

## Configuration

### Layered config (priority — later wins)

1. `appsettings.json` (base, always loaded)
2. `appsettings.{Environment}.json` (Development / Production)
3. **User Secrets** (Development only — stored outside repo)
4. Environment variables
5. Command-line args (`--Foo=Bar`)

### Settings classes (Options pattern)

`FormBuilder.Service/Config/`:

```csharp
public class JwtSettings {
    public string Secret { get; set; }
    public string Issuer { get; set; }
    public string Audience { get; set; }
    public int ExpirationDays { get; set; } = 7;
}
```

Bound in `AddServiceLayer`:
```csharp
services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
```

Injected into services:
```csharp
public JwtService(IOptions<JwtSettings> options) { _settings = options.Value; }
```

### User Secrets (never in git)

Sensitive dev-time values live outside the repo:

```powershell
cd FormBuilder.API
dotnet user-secrets init
dotnet user-secrets set "MongoDb:ConnectionString" "mongodb+srv://..."
dotnet user-secrets set "Jwt:Secret" "<random 48-char string>"
dotnet user-secrets list
```

Stored at `%APPDATA%\Microsoft\UserSecrets\<UserSecretsId>\secrets.json` on Windows. Referenced by the csproj's `<UserSecretsId>` GUID.

### Environment-specific overrides

`appsettings.Development.json` (in repo — no secrets):
- Verbose logging (`Debug` level)
- CORS whitelist including `localhost:5173-5185`
- Local DB name (`formbuilder_dev`)

Production: use environment variables (Azure App Service config, Docker secrets, Kubernetes secrets, or Azure Key Vault via `AddAzureKeyVault`).

---

## Authentication & Authorization

### JWT setup (`Program.cs`)

```csharp
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.Secret)),
            ClockSkew = TimeSpan.FromSeconds(30)
        };
    });
```

### Token generation — `JwtService.GenerateToken`

Claims included:
- `sub` — user's ObjectId (used to identify the caller)
- `email`
- `jti` — unique token ID
- `name` — username
- `role`

Signed HMAC-SHA256 with the secret from `IOptions<JwtSettings>`.

### Reading userId in a controller

```csharp
var userId = HttpContext.GetCurrentUserId();     // extension in API/Helper
```

Falls back to `sub` claim, then `NameIdentifier`.

### Protecting endpoints

```csharp
[Authorize]                    // class or method
[ApiController]
public class FormsController : ControllerBase { ... }
```

Public endpoints (`AuthController.Register/Login`, `PublicFormsController.*`, `HealthController`) simply don't have `[Authorize]`.

### Password hashing

`FormBuilder.Utilities/PasswordHasher.cs`:

```csharp
public static string Hash(string password) =>
    BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);

public static bool Verify(string password, string hash) {
    try { return BCrypt.Net.BCrypt.Verify(password, hash); }
    catch { return false; }
}
```

Work factor 12 = ~250ms per hash on modern hardware. Slower = safer against offline brute-force.

Full JWT deep-dive: [`docs/04_AUTH_FLOW.md`](./04_AUTH_FLOW.md).

---

## Repository Pattern

Each collection has an interface + implementation:

### Interface

```csharp
public interface IUserRepository {
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task<bool> ExistsByEmailAsync(string email);
    Task InsertAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(string id);
}
```

### Implementation

```csharp
public class UserRepository : IUserRepository {
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public Task<User?> GetByIdAsync(string id) =>
        _db.Users.Find(u => u.Id == id).FirstOrDefaultAsync()!;

    public Task InsertAsync(User user) => _db.Users.InsertOneAsync(user);
    // ...
}
```

### Why repositories?

- Makes services **testable** — mock `IUserRepository` in xUnit
- Isolates MongoDB from business logic — swap to another DB without touching Service
- Single place to change how a query works

### `AppDbContext`

Simple wrapper over `IMongoDatabase`:

```csharp
public class AppDbContext {
    public IMongoCollection<User> Users { get; }
    public IMongoCollection<Folder> Folders { get; }
    public IMongoCollection<Form> Forms { get; }
    public IMongoCollection<Submission> Submissions { get; }
    // ctor takes IOptions<MongoDbSettings>, opens the client, exposes collections
}
```

Registered as **singleton** (MongoDB client is thread-safe and expensive to create).

### Registration — `Data/DependencyInjection.cs`

```csharp
public static IServiceCollection AddDataLayer(this IServiceCollection services, IConfiguration configuration) {
    services.Configure<MongoDbSettings>(configuration.GetSection("MongoDb"));
    services.AddSingleton<AppDbContext>();
    services.AddScoped<IUserRepository, UserRepository>();
    services.AddScoped<IFolderRepository, FolderRepository>();
    services.AddScoped<IFormRepository, FormRepository>();
    services.AddScoped<ISubmissionRepository, SubmissionRepository>();
    return services;
}
```

Repositories are **scoped** (one instance per HTTP request).

---

## Service Layer & Response Envelope

Services orchestrate business rules, validation, and calls to repositories.

### Pattern

```csharp
public class AuthService : IAuthService {
    private readonly IUserRepository _userRepo;
    private readonly IJwtService _jwt;
    private readonly IMapper _mapper;

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto dto) {
        // 1. Validate inputs (build errors dict)
        // 2. Check business rules (email/username unique)
        // 3. Build entity
        // 4. Persist via repository
        // 5. Log the event
        // 6. Map entity → DTO
        // 7. Return ApiResponse<T>.Ok(...) or .Fail(...)
    }
}
```

### `ApiResponse<T>` wrapper

Every service returns this shape:

```csharp
public class ApiResponse {
    public bool Success { get; set; }
    public string? Message { get; set; }
    public Dictionary<string, List<string>>? Errors { get; set; }

    public static ApiResponse Ok(string? message = null) => new() { Success = true, Message = message };
    public static ApiResponse Fail(string message, Dictionary<string, List<string>>? errors = null) =>
        new() { Success = false, Message = message, Errors = errors };
}

public class ApiResponse<T> : ApiResponse {
    public T? Data { get; set; }
    public static ApiResponse<T> Ok(T data, string? message = null) => new() { Success = true, Data = data, Message = message };
    public new static ApiResponse<T> Fail(string message, Dictionary<string, List<string>>? errors = null) => new() { Success = false, Message = message, Errors = errors };
}
```

Every response the frontend gets:

```json
{
  "success": true,
  "data": { "id": "...", ... },
  "message": "Form created successfully.",
  "errors": null
}
```

Or on failure:

```json
{
  "success": false,
  "data": null,
  "message": "Validation failed.",
  "errors": { "email": ["Enter a valid email address."] }
}
```

Predictable → the frontend has one shared `unwrap()` helper.

### AutoMapper profiles

`FormBuilder.Service/Mappings/`:

- `AuthMappingProfile` — User → UserResponseDto
- `FolderMappingProfile` — Folder → FolderResponseDto
- `FormMappingProfile` — Form → FormResponseDto / FormListItemDto / PublicFormDto (with `Data` conversion for blocks)

Registered in `AddServiceLayer`:

```csharp
services.AddAutoMapper(cfg => {
    cfg.AddProfile<AuthMappingProfile>();
    cfg.AddProfile<FolderMappingProfile>();
    cfg.AddProfile<FormMappingProfile>();
});
```

---

## Controllers

Thin — just HTTP concerns. No business logic.

```csharp
[Authorize]
[ApiController]
[Route("api/folders")]
public class FoldersController : ControllerBase {
    private readonly IFolderService _folders;
    public FoldersController(IFolderService folders) => _folders = folders;

    [HttpGet]
    public async Task<IActionResult> GetMine() {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _folders.GetMyFoldersAsync(userId);
        return Ok(result);
    }
    // ...
}
```

**Pattern:**
1. Extract `userId` (via `HttpContext.GetCurrentUserId()`)
2. Bind request DTO (via `[FromBody]`)
3. Call service
4. Return `IActionResult` — success mapped to `Ok`/`Created`/`NoContent`, failure to `BadRequest`/`NotFound`/`Unauthorized`

Controllers never touch a repository directly. They never touch MongoDB. They never contain business rules. If a controller is getting fat, extract logic into a service.

---

## Middleware Pipeline

Order in `Program.cs` is critical — flows top-down, response flows bottom-up:

```
UseMiddleware<ExceptionHandlingMiddleware>();     ← catches everything below
UseSerilogRequestLogging();                        ← logs request start/end
UseSwagger() / UseSwaggerUI();                     ← dev only, /swagger UI
UseCors("frontend");                               ← check Origin header
UseAuthentication();                               ← validate JWT
UseAuthorization();                                ← check [Authorize]
MapControllers();                                  ← route to controller
```

### `ExceptionHandlingMiddleware`

```csharp
public async Task Invoke(HttpContext context) {
    try {
        await _next(context);
    }
    catch (Exception ex) {
        AppLogger.Error(ex, "Unhandled exception on {Path}", context.Request.Path.Value);
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var payload = ApiResponse.Fail(ErrorMessages.InternalServerError);
        await context.Response.WriteAsync(JsonSerializer.Serialize(payload, ...));
    }
}
```

**Never** leaks a stack trace to the client. Full stack trace goes to Serilog (both console and file).

---

## Logging (Serilog)

Configured **statically** at the top of `Program.cs`:

```csharp
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/formbuilder-.log", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();

builder.Host.UseSerilog();
```

### Sinks

- **Console** — dev only, colored output
- **File** — `logs/formbuilder-YYYYMMDD.log`, one file per day

### Levels

- `Debug` in Development (from `appsettings.Development.json`)
- `Information` in Production (from `appsettings.json`)

### `AppLogger` wrapper

Instead of injecting `ILogger<T>` everywhere, use a static wrapper:

```csharp
// FormBuilder.Utilities/AppLogger.cs
public static class AppLogger {
    public static void Info(string message, params object[] args) => Log.Information(message, args);
    public static void Warn(string message, params object[] args) => Log.Warning(message, args);
    public static void Error(Exception ex, string message, params object[] args) => Log.Error(ex, message, args);
    // ...
}
```

Usage anywhere:
```csharp
AppLogger.Info("User registered {UserId} {Email}", user.Id, user.Email);
AppLogger.Warn("Failed login attempt for {Email}", email);
AppLogger.Error(ex, "Failed to ensure indexes");
```

### What gets logged automatically

- **All HTTP requests**: method, path, status, duration (via `UseSerilogRequestLogging`)
- **All controller actions**: enter/exit, duration
- **All unhandled exceptions**: full stack trace (via `ExceptionHandlingMiddleware`)

### What's logged manually

- User events (register, login, password change)
- Failed login attempts (Warn level)
- Data mutations (folder created, form deleted, workspace cleared)

---

## Error Handling

**Everywhere** the pattern is: return an `ApiResponse.Fail(message, errors)`.

### Validation errors

```csharp
var errors = new Dictionary<string, List<string>>();
if (string.IsNullOrWhiteSpace(username))
    errors["username"] = new List<string> { "Username is required." };
if (!email.IsValidEmail())
    errors["email"] = new List<string> { "Enter a valid email address." };

if (errors.Count > 0)
    return ApiResponse<AuthResponseDto>.Fail(ErrorMessages.ValidationFailed, errors);
```

### Business rule violations

```csharp
if (await _userRepo.ExistsByEmailAsync(email))
    return ApiResponse<AuthResponseDto>.Fail(ErrorMessages.EmailAlreadyRegistered);
```

### 404 (resource not found)

```csharp
var folder = await _folderRepo.GetByIdAsync(folderId);
if (folder == null || folder.UserId != userId)
    return ApiResponse<FolderResponseDto>.Fail(ErrorMessages.FolderNotFound);
```

Note: "not found" AND "not owned by current user" both return the same message. This intentionally prevents leaking whether an ID exists in someone else's account.

### Unhandled exceptions

Caught by middleware — logged to Serilog, response becomes:
```json
{ "success": false, "message": "Something went wrong. Please try again later." }
```

No stack trace to the client, ever.

---

## MongoDB Integration

### Driver — `MongoDB.Driver`

Provides LINQ-compatible query API + async operations.

### `AppDbContext` (singleton)

Owns the `MongoClient` (thread-safe, connection pooling built-in) and exposes strongly-typed collections.

### Bson attributes on Models

```csharp
[BsonId]
[BsonRepresentation(BsonType.ObjectId)]
public string Id { get; set; } = string.Empty;

[BsonElement("username")]
public string Username { get; set; } = string.Empty;

[BsonElement("createdAt")]
public DateTime CreatedAt { get; set; }
```

`[BsonRepresentation(BsonType.ObjectId)]` on a `string` property tells the driver to store/retrieve it as an ObjectId in Mongo but expose it as `string` in C#.

### Query patterns

**Simple query (LINQ):**
```csharp
_db.Users.Find(u => u.Email == email).FirstOrDefaultAsync();
```

**Filtered + sorted:**
```csharp
await _db.Forms
    .Find(f => f.UserId == userId)
    .SortByDescending(f => f.UpdatedAt)
    .ToListAsync();
```

**Compound filter (`FilterDefinitionBuilder`):**
```csharp
var filter = Builders<Form>.Filter.Eq(f => f.UserId, userId);
if (folderId != null)
    filter &= Builders<Form>.Filter.Eq(f => f.FolderId, folderId);
```

**Atomic increment:**
```csharp
await _db.Forms.UpdateOneAsync(
    f => f.Id == formId,
    Builders<Form>.Update.Inc(f => f.Views, 1));
```

**Bulk delete:**
```csharp
_db.Submissions.DeleteManyAsync(s => formIds.Contains(s.FormId));
```

### `BsonJsonExtensions` (Utilities)

The `Block.Data` field is `BsonDocument` (free-form) but the API sends/receives it as `JsonElement`. Conversion helpers:

```csharp
public static BsonDocument ToBsonDocument(this JsonElement element) =>
    BsonDocument.Parse(element.GetRawText());

public static JsonElement ToJsonElement(this BsonDocument bson) {
    var json = bson.ToJson(new JsonWriterSettings { OutputMode = JsonOutputMode.RelaxedExtendedJson });
    using var doc = JsonDocument.Parse(json);
    return doc.RootElement.Clone();
}
```

Used in `FormService.UpdateAsync` (JSON → Bson) and `FormResponseDto` mapping (Bson → JSON).

### Index creation on startup

`Program.cs`:
```csharp
using (var scope = app.Services.CreateScope()) {
    try {
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        await MongoIndexHelper.EnsureIndexesAsync(db);
    } catch (Exception ex) {
        AppLogger.Error(ex, "Failed to ensure MongoDB indexes");
    }
}
```

`MongoIndexHelper.EnsureIndexesAsync` — idempotent (MongoDB ignores duplicate index creation).

---

## Testing Strategy

### Setup

`FormBuilder.UnitTests` references all main projects. Uses:
- **xUnit** — test framework
- **Moq** — mock objects
- **FluentAssertions** — expressive assertions

### Example: `AuthServiceTests.cs`

```csharp
public class AuthServiceTests {
    private readonly Mock<IUserRepository> _userRepo = new();
    private readonly Mock<IJwtService> _jwt = new();
    private readonly IMapper _mapper;
    private readonly AuthService _sut;

    public AuthServiceTests() {
        var config = new MapperConfiguration(cfg => cfg.AddProfile<AuthMappingProfile>());
        _mapper = config.CreateMapper();
        _sut = new AuthService(_userRepo.Object, _jwt.Object, _mapper);
    }

    [Fact]
    public async Task RegisterAsync_WithValidData_ReturnsSuccessAndToken() {
        // Arrange
        var dto = new RegisterRequestDto { Username = "julfikar", Email = "j@e.com", Password = "Secret123!" };
        _userRepo.Setup(r => r.ExistsByEmailAsync(It.IsAny<string>())).ReturnsAsync(false);
        _userRepo.Setup(r => r.ExistsByUsernameAsync(It.IsAny<string>())).ReturnsAsync(false);
        _jwt.Setup(j => j.GenerateToken(It.IsAny<User>())).Returns("fake-jwt");

        // Act
        var result = await _sut.RegisterAsync(dto);

        // Assert
        result.Success.Should().BeTrue();
        result.Data!.Token.Should().Be("fake-jwt");
        _userRepo.Verify(r => r.InsertAsync(It.IsAny<User>()), Times.Once);
    }
}
```

**Testing conventions:**
- One test class per service class
- One test method per scenario (happy path + edge cases)
- **Arrange / Act / Assert** with visible section comments
- No real DB in unit tests — always mock repositories

### Running tests

```powershell
dotnet test
```

Or via VS Code Test Explorer (C# Dev Kit).

### Integration tests (future)

Not built yet. Would go in `FormBuilder.IntegrationTests/`:
- Use `WebApplicationFactory<Program>` to spin up the full API in-memory
- Use TestContainers or an in-memory Mongo emulator
- Hit real HTTP endpoints

---

## Running & Debugging

### From CLI

```powershell
cd D:\Julfikar\Projects\FormBuilder
dotnet restore                       # first time
dotnet build
dotnet run --project FormBuilder.API
```

Opens on **http://localhost:5000** (see `launchSettings.json`). Browser auto-opens **/swagger**.

### From VS Code

See `.vscode/launch.json` and `.vscode/tasks.json`.

- **F5** — starts debugger with **Backend: Debug FormBuilder.API** config
- **Ctrl+Shift+P → Run Task → build-api** — build only
- **Ctrl+Shift+P → Run Task → test** — run tests
- **Ctrl+Shift+P → Run Task → watch-api** — hot-reload (no debugger)

Set breakpoints in `.cs` files by clicking in the gutter.

### From Visual Studio 2022

Open `FormBuilder.sln`. Right-click `FormBuilder.API` → Set as Startup Project. Press F5.

---

## Adding a New Endpoint

Recipe (following the existing patterns):

### Example: Add "duplicate a form" — `POST /api/forms/{id}/duplicate`

**1. DTO** — `FormBuilder.Core/DTOs/Form/`:

Nothing new needed — response is the existing `FormResponseDto`.

**2. Service interface** — `FormBuilder.Service/Interface/IFormService.cs`:

```csharp
Task<ApiResponse<FormResponseDto>> DuplicateAsync(string userId, string formId);
```

**3. Service implementation** — `FormBuilder.Service/Implement/FormService.cs`:

```csharp
public async Task<ApiResponse<FormResponseDto>> DuplicateAsync(string userId, string formId) {
    var source = await _formRepo.GetByIdAsync(formId);
    if (source == null || source.UserId != userId)
        return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FormNotFound);

    var copy = new Form {
        UserId = userId,
        FolderId = source.FolderId,
        Name = $"{source.Name} (copy)",
        ThemeId = source.ThemeId,
        Blocks = source.Blocks.Select(b => new Block {
            Id = Guid.NewGuid().ToString("N")[..12],
            Type = b.Type,
            Data = new BsonDocument(b.Data)
        }).ToList(),
        Views = 0, Starts = 0, SubmissionCount = 0,
        CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow
    };
    await _formRepo.InsertAsync(copy);
    AppLogger.Info("Form {SourceId} duplicated as {NewId}", formId, copy.Id);
    return ApiResponse<FormResponseDto>.Ok(_mapper.Map<FormResponseDto>(copy), "Form duplicated.");
}
```

**4. Controller** — `FormBuilder.API/Controllers/FormsController.cs`:

```csharp
[HttpPost("{id}/duplicate")]
public async Task<IActionResult> Duplicate(string id) {
    var userId = HttpContext.GetCurrentUserId()!;
    var result = await _forms.DuplicateAsync(userId, id);
    return result.Success
        ? StatusCode((int)ResponseCode.Created, result)
        : NotFound(result);
}
```

**5. Test** — `FormBuilder.UnitTests/Services/FormServiceTests.cs`:

```csharp
[Fact]
public async Task DuplicateAsync_WithValidForm_CreatesCopy() { ... }

[Fact]
public async Task DuplicateAsync_WithMissingForm_ReturnsFail() { ... }
```

**6. Frontend consumer** — `FormBuilder.UI/src/features/dashboard/api/formsApi.js`:

```js
async duplicate(id) {
    const res = await apiClient.post(`/forms/${id}/duplicate`)
    return unwrap(res)
}
```

**7. React Query hook** — `hooks/useForms.js`:

```js
export function useDuplicateForm() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: formsApi.duplicate,
        onSuccess: ({ message }) => {
            qc.invalidateQueries({ queryKey: ['forms'] })
            toast.success(message || 'Form duplicated')
        },
    })
}
```

**8. Wire it up in the UI** — add a button + call `useDuplicateForm().mutate(id)`.

Same pattern for every new endpoint.

---

## Deployment Considerations

Not built yet, but recipe:

### Where to host

| Component | Options |
|-----------|---------|
| **API** | Azure App Service, Azure Container Apps, AWS App Runner, Docker + any VPS |
| **MongoDB** | MongoDB Atlas (managed, free tier) — recommended |
| **Frontend** | Vercel, Netlify, Cloudflare Pages, Azure Static Web Apps |

### What to change for production

1. **Secrets** — move `Jwt:Secret` + `MongoDb:ConnectionString` to Azure Key Vault or env vars. Never commit to git.
2. **CORS** — replace `AllowedOrigins` array with the real production frontend domain only. No wildcards.
3. **HTTPS** — enable HTTPS redirect + HSTS in `Program.cs`.
4. **Rate limiting** — add `AspNetCoreRateLimit` package. Cap public endpoints at ~60 req/min per IP.
5. **Application Insights** — add `Serilog.Sinks.ApplicationInsights` for structured logs + APM.
6. **Log retention** — cap file size + count (currently unlimited).
7. **Sensitive data scrubbing** — audit logs to ensure no passwords/tokens leak.

### Docker (recipe — not implemented yet)

```dockerfile
# FormBuilder.API/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish FormBuilder.API/FormBuilder.API.csproj -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app .
EXPOSE 80
ENTRYPOINT ["dotnet", "FormBuilder.API.dll"]
```

Then:
```powershell
docker build -t formbuilder-api .
docker run -p 5000:80 -e MongoDb__ConnectionString="..." -e Jwt__Secret="..." formbuilder-api
```

### CI/CD (recipe)

**GitHub Actions** — `.github/workflows/api.yml`:
1. Checkout
2. Setup .NET 9
3. `dotnet restore`
4. `dotnet build --no-restore`
5. `dotnet test --no-build`
6. If on `main`: `dotnet publish` → deploy to Azure App Service

**Frontend** — Vercel/Netlify hook into GitHub. Pushes to `main` auto-deploy.

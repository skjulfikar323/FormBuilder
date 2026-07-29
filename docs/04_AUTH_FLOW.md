# Authentication Flow (JWT)

If JWT is new to you, this doc explains it simply, with a picture and the exact steps.

## What's a JWT?

A **JSON Web Token** is a signed string the server hands you when you log in. You send it back on every subsequent request, and the server checks the signature to confirm it's really you.

A JWT looks like: `eyJhbGciOi...` — three parts separated by dots.

```
[header].[payload].[signature]
   base64      base64       HMAC-SHA256
```

The **payload** contains claims like:
```json
{
  "sub": "651a7b3c9f1a2b3c4d5e6f70",   // user id
  "email": "julfikar@example.com",
  "role": "user",
  "exp": 1730000000                     // expiration Unix timestamp
}
```

The **signature** is generated using your server's secret key. If anyone tampers with the payload, the signature no longer matches and the server rejects the token.

**Key point**: JWTs are **not encrypted** — anyone with the token can decode the payload (paste one at https://jwt.io). They're **signed**, meaning tamper-proof.

So: don't put secrets like passwords in the payload. Just put identifiers (user id, roles).

---

## The full auth flow

```
┌──────────────┐                          ┌──────────────┐                 ┌──────────────┐
│   Frontend   │                          │   Backend    │                 │   MongoDB    │
│  (Browser)   │                          │   Web API    │                 │              │
└──────┬───────┘                          └──────┬───────┘                 └──────┬───────┘
       │                                         │                                │
       │  1. POST /api/auth/login                │                                │
       │  { email, password }                    │                                │
       │─────────────────────────────────────────▶                                │
       │                                         │                                │
       │                                         │  2. Find user by email         │
       │                                         │───────────────────────────────▶│
       │                                         │◀───────────────────────────────│
       │                                         │  user document (with hash)     │
       │                                         │                                │
       │                                         │  3. BCrypt.Verify(pwd, hash)   │
       │                                         │                                │
       │                                         │  4. Generate JWT:              │
       │                                         │     - claims: sub=userId       │
       │                                         │     - sign with secret key     │
       │                                         │     - set 7-day expiration     │
       │                                         │                                │
       │  5. { token, user }                     │                                │
       │◀────────────────────────────────────────│                                │
       │                                         │                                │
       │  6. Store token in localStorage         │                                │
       │                                         │                                │
       │                                         │                                │
       │  7. GET /api/forms                      │                                │
       │  Authorization: Bearer <token>          │                                │
       │─────────────────────────────────────────▶                                │
       │                                         │                                │
       │                                         │  8. Middleware:                │
       │                                         │     - extract token from       │
       │                                         │       Authorization header     │
       │                                         │     - verify signature         │
       │                                         │     - check exp not passed     │
       │                                         │     - attach userId to Request │
       │                                         │                                │
       │                                         │  9. Query forms                │
       │                                         │  where userId = <from token>   │
       │                                         │───────────────────────────────▶│
       │                                         │◀───────────────────────────────│
       │  10. [ ...forms ]                       │                                │
       │◀────────────────────────────────────────│                                │
```

## Step-by-step in code (conceptual)

### Step 4 — Generating the JWT (backend, on login/register)

```csharp
var claims = new[]
{
    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
    new Claim(JwtRegisteredClaimNames.Email, user.Email),
    new Claim(ClaimTypes.Role, user.Role),
};

var key = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(configuration["Jwt:Secret"])
);
var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

var token = new JwtSecurityToken(
    issuer:    configuration["Jwt:Issuer"],
    audience:  configuration["Jwt:Audience"],
    claims:    claims,
    expires:   DateTime.UtcNow.AddDays(7),
    signingCredentials: creds
);

return new JwtSecurityTokenHandler().WriteToken(token);
```

### Step 8 — Verifying the JWT (backend, middleware — set up once)

In `Program.cs`:
```csharp
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Secret"])
            ),
        };
    });

// ...

app.UseAuthentication();
app.UseAuthorization();
```

Then on each controller:
```csharp
[Authorize]  // <-- this makes JWT required
[ApiController]
[Route("api/[controller]")]
public class FormsController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> List()
    {
        // Extract the user's ID from the token
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub).Value;

        var forms = await _formsService.GetByUserAsync(userId);
        return Ok(forms);
    }
}
```

### Step 6 — Frontend storing the token

The Zustand store (already in the frontend code):
```js
setSession: (user, token) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    set({ user, token, isAuthenticated: true })
}
```

### Step 7 — Frontend attaching the token to every request

The axios interceptor (already in `src/config/api.js`):
```js
axios.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})
```

## Configuration (dev)

`appsettings.Development.json` on the backend:
```json
{
  "Jwt": {
    "Secret": "REPLACE-WITH-A-32-CHAR-RANDOM-STRING",
    "Issuer": "formbuilder-api",
    "Audience": "formbuilder-ui",
    "ExpirationDays": 7
  }
}
```

**Generate a strong secret** (PowerShell):
```powershell
$bytes = New-Object byte[] 32
[Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[Convert]::ToBase64String($bytes)
```

**Never commit the real secret.** Put dev secrets in `appsettings.Development.json` (git-ignored), prod secrets in Azure Key Vault / GitHub Secrets / env vars.

## Common questions

### What happens when the token expires?

Backend returns `401 Unauthorized`. Frontend axios interceptor catches this and redirects to `/login`.

Set up the interceptor:
```js
axios.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('auth_token')
            window.location.href = '/login'
        }
        throw err
    }
)
```

### Can I invalidate a token before it expires?

Not natively with JWT. Options:
1. **Short-lived tokens + refresh tokens**: access token expires in 15 min, refresh token expires in 30 days. On expiry, use refresh token to get a new access token. Revoking a refresh token effectively logs out the user.
2. **Token blacklist**: store revoked tokens in Redis with their `exp` as the TTL. Middleware checks the blacklist on every request. Adds a DB call to every request — slower.
3. **Change the JWT secret**: invalidates ALL tokens across ALL users. Nuclear option.

For a portfolio project, **skip refresh tokens** — 7-day expiration is fine.

### Should I use httpOnly cookies instead?

**Cookies (httpOnly, sameSite=strict)** are more secure than `localStorage` because JavaScript can't read them → immune to XSS token theft.

**Trade-off**: cookies auto-send on every request, so you need CSRF protection. Also, the frontend needs to be on the same domain (or use `Access-Control-Allow-Credentials`).

For our project: `localStorage` is fine for a learning portfolio. If you deploy to prod, migrate to httpOnly cookies + CSRF token.

## Password security

- **Never store plain-text passwords.** Always hash with BCrypt (cost factor ≥ 10).
- **Rate-limit login attempts** to prevent brute force (e.g., 5 attempts / 15 min per IP or per email).
- **Password reset flow** (not implemented yet): user requests reset → email with time-limited token → click link → set new password.
- **Password minimum**: 8 chars in our schema. Ideally add strength meter and encourage passphrases.

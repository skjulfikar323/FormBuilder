using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace FormBuilder.API.Helper;

public static class ControllerExtensions
{
    public static string? GetCurrentUserId(this HttpContext http)
    {
        return http.User?.FindFirst(JwtRegisteredClaimNames.Sub)?.Value
            ?? http.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}

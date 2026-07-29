using FormBuilder.API.Helper;
using FormBuilder.Core.DTOs.Auth;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilder.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _auth;
    private readonly IUserService _users;

    public AuthController(IAuthService auth, IUserService users)
    {
        _auth = auth;
        _users = users;
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var userId = HttpContext.GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse.Fail(ErrorMessages.Unauthorized));

        var result = await _users.GetCurrentUserAsync(userId);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto dto)
    {
        var result = await _auth.RegisterAsync(dto);
        return result.Success
            ? StatusCode((int)ResponseCode.Created, result)
            : BadRequest(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto dto)
    {
        var result = await _auth.LoginAsync(dto);
        return result.Success
            ? Ok(result)
            : Unauthorized(result);
    }

    [Authorize]
    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto dto)
    {
        var userId = HttpContext.GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse.Fail(ErrorMessages.Unauthorized));

        var result = await _auth.ChangePasswordAsync(userId, dto);
        return result.Success
            ? Ok(result)
            : BadRequest(result);
    }

    [Authorize]
    [HttpPost("logout")]
    public IActionResult Logout() =>
        Ok(ApiResponse.Ok(SuccessMessages.LoggedOut));
}

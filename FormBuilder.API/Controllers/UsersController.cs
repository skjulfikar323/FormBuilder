using FormBuilder.API.Helper;
using FormBuilder.Core.DTOs.User;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilder.API.Controllers;

[Authorize]
[ApiController]
[Route("api/users")]
public class UsersController : ControllerBase
{
    private readonly IUserService _users;
    public UsersController(IUserService users) => _users = users;

    [HttpPut("me")]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequestDto dto)
    {
        var userId = HttpContext.GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse.Fail(ErrorMessages.Unauthorized));
        var result = await _users.UpdateProfileAsync(userId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpPut("me/preferences")]
    public async Task<IActionResult> UpdatePreferences([FromBody] UserPreferencesDto dto)
    {
        var userId = HttpContext.GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse.Fail(ErrorMessages.Unauthorized));
        var result = await _users.UpdatePreferencesAsync(userId, dto);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("me/workspace")]
    public async Task<IActionResult> ClearWorkspace()
    {
        var userId = HttpContext.GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse.Fail(ErrorMessages.Unauthorized));
        var result = await _users.ClearWorkspaceAsync(userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }

    [HttpDelete("me")]
    public async Task<IActionResult> DeleteAccount()
    {
        var userId = HttpContext.GetCurrentUserId();
        if (string.IsNullOrEmpty(userId))
            return Unauthorized(ApiResponse.Fail(ErrorMessages.Unauthorized));
        var result = await _users.DeleteAccountAsync(userId);
        return result.Success ? Ok(result) : BadRequest(result);
    }
}

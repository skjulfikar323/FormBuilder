using FormBuilder.Core.DTOs.User;

namespace FormBuilder.Core.DTOs.Auth;

public class AuthResponseDto
{
    public string Token { get; set; } = string.Empty;
    public UserResponseDto User { get; set; } = new();
}

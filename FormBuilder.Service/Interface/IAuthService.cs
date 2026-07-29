using FormBuilder.Core.DTOs.Auth;
using FormBuilder.Message;

namespace FormBuilder.Service.Interface;

public interface IAuthService
{
    Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto dto);
    Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto dto);
    Task<ApiResponse> ChangePasswordAsync(string userId, ChangePasswordRequestDto dto);
}

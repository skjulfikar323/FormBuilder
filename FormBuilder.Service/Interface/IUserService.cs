using FormBuilder.Core.DTOs.User;
using FormBuilder.Message;

namespace FormBuilder.Service.Interface;

public interface IUserService
{
    Task<ApiResponse<UserResponseDto>> GetCurrentUserAsync(string userId);
    Task<ApiResponse<UserResponseDto>> UpdateProfileAsync(string userId, UpdateProfileRequestDto dto);
    Task<ApiResponse<UserPreferencesDto>> UpdatePreferencesAsync(string userId, UserPreferencesDto dto);
    Task<ApiResponse> ClearWorkspaceAsync(string userId);
    Task<ApiResponse> DeleteAccountAsync(string userId);
}

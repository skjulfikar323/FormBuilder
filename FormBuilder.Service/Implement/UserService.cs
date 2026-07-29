using AutoMapper;
using FormBuilder.Core.Constants;
using FormBuilder.Core.DTOs.User;
using FormBuilder.Data.Interface;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using FormBuilder.Utilities;

namespace FormBuilder.Service.Implement;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepo;
    private readonly IFolderRepository _folderRepo;
    private readonly IFormRepository _formRepo;
    private readonly ISubmissionRepository _subRepo;
    private readonly IMapper _mapper;

    public UserService(
        IUserRepository userRepo,
        IFolderRepository folderRepo,
        IFormRepository formRepo,
        ISubmissionRepository subRepo,
        IMapper mapper)
    {
        _userRepo = userRepo;
        _folderRepo = folderRepo;
        _formRepo = formRepo;
        _subRepo = subRepo;
        _mapper = mapper;
    }

    public async Task<ApiResponse<UserResponseDto>> GetCurrentUserAsync(string userId)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<UserResponseDto>.Fail(ErrorMessages.UserNotFound);
        return ApiResponse<UserResponseDto>.Ok(_mapper.Map<UserResponseDto>(user));
    }

    public async Task<ApiResponse<UserResponseDto>> UpdateProfileAsync(string userId, UpdateProfileRequestDto dto)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<UserResponseDto>.Fail(ErrorMessages.UserNotFound);

        var errors = new Dictionary<string, List<string>>();

        if (!string.IsNullOrWhiteSpace(dto.FullName))
            user.FullName = dto.FullName.SafeTrim();

        if (!string.IsNullOrWhiteSpace(dto.Email))
        {
            var newEmail = dto.Email.SafeTrim().ToLowerInvariant();
            if (!newEmail.IsValidEmail())
                errors["email"] = new List<string> { "Enter a valid email address." };
            else if (newEmail != user.Email && await _userRepo.ExistsByEmailAsync(newEmail))
                errors["email"] = new List<string> { ErrorMessages.EmailAlreadyRegistered };
            else
                user.Email = newEmail;
        }

        if (errors.Count > 0)
            return ApiResponse<UserResponseDto>.Fail(ErrorMessages.ValidationFailed, errors);

        user.UpdatedAt = DateTime.UtcNow;
        await _userRepo.UpdateAsync(user);
        AppLogger.Info("Profile updated for {UserId}", userId);
        return ApiResponse<UserResponseDto>.Ok(_mapper.Map<UserResponseDto>(user), SuccessMessages.ProfileUpdated);
    }

    public async Task<ApiResponse<UserPreferencesDto>> UpdatePreferencesAsync(string userId, UserPreferencesDto dto)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse<UserPreferencesDto>.Fail(ErrorMessages.UserNotFound);

        if (!AppConstants.Themes.All.Contains(dto.ThemeId))
            return ApiResponse<UserPreferencesDto>.Fail(ErrorMessages.InvalidThemeId);

        user.Preferences.ThemeId = dto.ThemeId;
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepo.UpdateAsync(user);
        return ApiResponse<UserPreferencesDto>.Ok(
            new UserPreferencesDto { ThemeId = user.Preferences.ThemeId },
            SuccessMessages.PreferencesUpdated);
    }

    public async Task<ApiResponse> ClearWorkspaceAsync(string userId)
    {
        // Delete all forms first (get their IDs so we cascade-delete their submissions)
        var forms = await _formRepo.GetByUserAsync(userId);
        var formIds = forms.Select(f => f.Id).ToList();
        if (formIds.Count > 0)
            await _subRepo.DeleteByFormsAsync(formIds);

        await _formRepo.DeleteByUserAsync(userId);

        // Delete folders
        var folders = await _folderRepo.GetByUserAsync(userId);
        foreach (var folder in folders)
            await _folderRepo.DeleteAsync(folder.Id);

        AppLogger.Info("Workspace cleared for {UserId}", userId);
        return ApiResponse.Ok(SuccessMessages.WorkspaceCleared);
    }

    public async Task<ApiResponse> DeleteAccountAsync(string userId)
    {
        // Cascade
        await ClearWorkspaceAsync(userId);
        await _userRepo.DeleteAsync(userId);
        AppLogger.Info("Account deleted {UserId}", userId);
        return ApiResponse.Ok(SuccessMessages.AccountDeleted);
    }
}

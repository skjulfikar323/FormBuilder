using AutoMapper;
using FormBuilder.Core.DTOs.Auth;
using FormBuilder.Core.DTOs.User;
using FormBuilder.Core.Enums;
using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using FormBuilder.Utilities;

namespace FormBuilder.Service.Implement;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepo;
    private readonly IJwtService _jwt;
    private readonly IMapper _mapper;

    public AuthService(IUserRepository userRepo, IJwtService jwt, IMapper mapper)
    {
        _userRepo = userRepo;
        _jwt = jwt;
        _mapper = mapper;
    }

    public async Task<ApiResponse<AuthResponseDto>> RegisterAsync(RegisterRequestDto dto)
    {
        var username = dto.Username.SafeTrim();
        var email = dto.Email.SafeTrim().ToLowerInvariant();
        var password = dto.Password ?? string.Empty;

        var errors = new Dictionary<string, List<string>>();
        if (string.IsNullOrWhiteSpace(username) || username.Length < 3)
            errors["username"] = new List<string> { "Username must be at least 3 characters." };
        if (!email.IsValidEmail())
            errors["email"] = new List<string> { "Enter a valid email address." };
        if (password.Length < 8)
            errors["password"] = new List<string> { ErrorMessages.PasswordTooShort };
        if (errors.Count > 0)
            return ApiResponse<AuthResponseDto>.Fail(ErrorMessages.ValidationFailed, errors);

        if (await _userRepo.ExistsByEmailAsync(email))
            return ApiResponse<AuthResponseDto>.Fail(ErrorMessages.EmailAlreadyRegistered);

        if (await _userRepo.ExistsByUsernameAsync(username))
            return ApiResponse<AuthResponseDto>.Fail(ErrorMessages.UsernameAlreadyTaken);

        var user = new User
        {
            Username = username,
            Email = email,
            FullName = username,
            PasswordHash = PasswordHasher.Hash(password),
            Role = UserRole.User,
            Preferences = new UserPreferences { ThemeId = "dark" },
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        await _userRepo.InsertAsync(user);
        AppLogger.Info("User registered {UserId} {Email}", user.Id, user.Email);

        var token = _jwt.GenerateToken(user);
        var response = new AuthResponseDto
        {
            Token = token,
            User = _mapper.Map<UserResponseDto>(user)
        };
        return ApiResponse<AuthResponseDto>.Ok(response, SuccessMessages.Registered);
    }

    public async Task<ApiResponse<AuthResponseDto>> LoginAsync(LoginRequestDto dto)
    {
        var email = dto.Email.SafeTrim().ToLowerInvariant();
        var user = await _userRepo.GetByEmailAsync(email);
        if (user == null || !PasswordHasher.Verify(dto.Password ?? string.Empty, user.PasswordHash))
        {
            AppLogger.Warn("Failed login attempt for {Email}", email);
            return ApiResponse<AuthResponseDto>.Fail(ErrorMessages.InvalidCredentials);
        }

        var token = _jwt.GenerateToken(user);
        var response = new AuthResponseDto
        {
            Token = token,
            User = _mapper.Map<UserResponseDto>(user)
        };
        AppLogger.Info("User logged in {UserId}", user.Id);
        return ApiResponse<AuthResponseDto>.Ok(response, SuccessMessages.LoggedIn);
    }

    public async Task<ApiResponse> ChangePasswordAsync(string userId, ChangePasswordRequestDto dto)
    {
        var user = await _userRepo.GetByIdAsync(userId);
        if (user == null)
            return ApiResponse.Fail(ErrorMessages.UserNotFound);

        if (!PasswordHasher.Verify(dto.CurrentPassword ?? string.Empty, user.PasswordHash))
            return ApiResponse.Fail(ErrorMessages.CurrentPasswordIncorrect);

        var newPassword = dto.NewPassword ?? string.Empty;
        if (newPassword.Length < 8)
            return ApiResponse.Fail(ErrorMessages.PasswordTooShort);

        if (PasswordHasher.Verify(newPassword, user.PasswordHash))
            return ApiResponse.Fail(ErrorMessages.NewPasswordMustDiffer);

        user.PasswordHash = PasswordHasher.Hash(newPassword);
        user.UpdatedAt = DateTime.UtcNow;
        await _userRepo.UpdateAsync(user);

        AppLogger.Info("Password changed for {UserId}", userId);
        return ApiResponse.Ok(SuccessMessages.PasswordChanged);
    }
}

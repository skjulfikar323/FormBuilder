namespace FormBuilder.Core.DTOs.User;

public class UserResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public UserPreferencesDto Preferences { get; set; } = new();
}

public class UserPreferencesDto
{
    public string ThemeId { get; set; } = "dark";
}

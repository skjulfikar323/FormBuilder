namespace FormBuilder.Service.Config;

public class JwtSettings
{
    public string Secret { get; set; } = string.Empty;
    public string Issuer { get; set; } = "formbuilder-api";
    public string Audience { get; set; } = "formbuilder-ui";
    public int ExpirationDays { get; set; } = 7;
}

namespace FormBuilder.Utilities;

public static class PasswordHasher
{
    private const int WorkFactor = 12;

    public static string Hash(string password)
        => BCrypt.Net.BCrypt.HashPassword(password, WorkFactor);

    public static bool Verify(string password, string hash)
    {
        try { return BCrypt.Net.BCrypt.Verify(password, hash); }
        catch { return false; }
    }
}

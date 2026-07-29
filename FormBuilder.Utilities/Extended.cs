using System.Text.RegularExpressions;

namespace FormBuilder.Utilities;

public static class Extended
{
    public static bool IsValidEmail(this string? email)
    {
        if (string.IsNullOrWhiteSpace(email)) return false;
        return Regex.IsMatch(email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$");
    }

    public static string ToSlug(this string? value, int maxLength = 20)
    {
        if (string.IsNullOrWhiteSpace(value)) return "user";
        var slug = Regex.Replace(value.ToLowerInvariant(), "[^a-z0-9]+", "");
        return slug.Length > maxLength ? slug[..maxLength] : slug;
    }

    public static string SafeTrim(this string? value)
        => string.IsNullOrWhiteSpace(value) ? string.Empty : value.Trim();

    public static bool IsValidObjectId(this string? id)
    {
        if (string.IsNullOrWhiteSpace(id)) return false;
        return Regex.IsMatch(id, @"^[a-fA-F0-9]{24}$");
    }
}

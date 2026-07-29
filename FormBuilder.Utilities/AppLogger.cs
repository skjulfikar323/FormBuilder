using Serilog;

namespace FormBuilder.Utilities;

public static class AppLogger
{
    public static void Info(string message, params object[] args)
        => Log.Information(message, args);

    public static void Warn(string message, params object[] args)
        => Log.Warning(message, args);

    public static void Error(string message, params object[] args)
        => Log.Error(message, args);

    public static void Error(Exception ex, string message, params object[] args)
        => Log.Error(ex, message, args);

    public static void Debug(string message, params object[] args)
        => Log.Debug(message, args);
}

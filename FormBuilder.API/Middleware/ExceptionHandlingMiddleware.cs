using System.Text.Json;
using FormBuilder.Message;
using FormBuilder.Utilities;

namespace FormBuilder.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionHandlingMiddleware(RequestDelegate next) => _next = next;

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            AppLogger.Error(ex, "Unhandled exception on {Path}", context.Request.Path.Value ?? "");
            context.Response.StatusCode = (int)ResponseCode.ServerError;
            context.Response.ContentType = "application/json";
            var payload = ApiResponse.Fail(ErrorMessages.InternalServerError);
            var json = JsonSerializer.Serialize(payload,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase });
            await context.Response.WriteAsync(json);
        }
    }
}

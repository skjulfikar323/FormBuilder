using FormBuilder.Message;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilder.API.Controllers;

[ApiController]
[Route("health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(ApiResponse<object>.Ok(new
    {
        status = "ok",
        service = "FormBuilder.API",
        time = DateTime.UtcNow
    }));
}

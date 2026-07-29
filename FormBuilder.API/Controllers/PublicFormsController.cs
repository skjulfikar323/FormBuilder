using FormBuilder.Core.DTOs.Submission;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilder.API.Controllers;

[ApiController]
[Route("api/public/forms")]
public class PublicFormsController : ControllerBase
{
    private readonly IPublicFormService _public;
    public PublicFormsController(IPublicFormService pub) => _public = pub;

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var result = await _public.GetPublicFormAsync(id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost("{id}/view")]
    public async Task<IActionResult> IncrementView(string id)
    {
        var result = await _public.IncrementViewAsync(id);
        return result.Success ? NoContent() : NotFound(result);
    }

    [HttpPost("{id}/start")]
    public async Task<IActionResult> IncrementStart(string id)
    {
        var result = await _public.IncrementStartAsync(id);
        return result.Success ? NoContent() : NotFound(result);
    }

    [HttpPost("{id}/submissions")]
    public async Task<IActionResult> Submit(string id, [FromBody] SubmissionRequestDto dto)
    {
        var ip = HttpContext.Connection.RemoteIpAddress?.ToString();
        var ua = Request.Headers["User-Agent"].ToString();
        var result = await _public.SubmitAsync(id, dto, ip, ua);
        return result.Success
            ? StatusCode((int)ResponseCode.Created, result)
            : BadRequest(result);
    }
}

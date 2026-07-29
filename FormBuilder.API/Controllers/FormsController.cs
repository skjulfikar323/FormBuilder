using FormBuilder.API.Helper;
using FormBuilder.Core.DTOs.Form;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilder.API.Controllers;

[Authorize]
[ApiController]
[Route("api/forms")]
public class FormsController : ControllerBase
{
    private readonly IFormService _forms;
    private readonly ISubmissionService _submissions;

    public FormsController(IFormService forms, ISubmissionService submissions)
    {
        _forms = forms;
        _submissions = submissions;
    }

    [HttpGet]
    public async Task<IActionResult> GetMine([FromQuery] string? folderId = null)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _forms.GetMyFormsAsync(userId, folderId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _forms.GetByIdAsync(userId, id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFormRequestDto dto)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _forms.CreateAsync(userId, dto);
        return result.Success
            ? StatusCode((int)ResponseCode.Created, result)
            : BadRequest(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, [FromBody] UpdateFormRequestDto dto)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _forms.UpdateAsync(userId, id, dto);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _forms.DeleteAsync(userId, id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    // Submissions (nested)
    [HttpGet("{id}/submissions")]
    public async Task<IActionResult> GetSubmissions(string id)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _submissions.GetForFormAsync(userId, id);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("{id}/submissions/{submissionId}")]
    public async Task<IActionResult> DeleteSubmission(string id, string submissionId)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _submissions.DeleteAsync(userId, id, submissionId);
        return result.Success ? Ok(result) : NotFound(result);
    }
}

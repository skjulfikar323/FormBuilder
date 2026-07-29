using FormBuilder.API.Helper;
using FormBuilder.Core.DTOs.Folder;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FormBuilder.API.Controllers;

[Authorize]
[ApiController]
[Route("api/folders")]
public class FoldersController : ControllerBase
{
    private readonly IFolderService _folders;
    public FoldersController(IFolderService folders) => _folders = folders;

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _folders.GetMyFoldersAsync(userId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateFolderRequestDto dto)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _folders.CreateAsync(userId, dto);
        return result.Success
            ? StatusCode((int)ResponseCode.Created, result)
            : BadRequest(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Rename(string id, [FromBody] RenameFolderRequestDto dto)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _folders.RenameAsync(userId, id, dto);
        return result.Success ? Ok(result) : NotFound(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var userId = HttpContext.GetCurrentUserId()!;
        var result = await _folders.DeleteAsync(userId, id);
        return result.Success ? Ok(result) : NotFound(result);
    }
}

using FormBuilder.Core.DTOs.Form;
using FormBuilder.Message;

namespace FormBuilder.Service.Interface;

public interface IFormService
{
    Task<ApiResponse<List<FormListItemDto>>> GetMyFormsAsync(string userId, string? folderId);
    Task<ApiResponse<FormResponseDto>> GetByIdAsync(string userId, string formId);
    Task<ApiResponse<FormResponseDto>> CreateAsync(string userId, CreateFormRequestDto dto);
    Task<ApiResponse<FormResponseDto>> UpdateAsync(string userId, string formId, UpdateFormRequestDto dto);
    Task<ApiResponse> DeleteAsync(string userId, string formId);
}

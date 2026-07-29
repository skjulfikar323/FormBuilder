using FormBuilder.Core.DTOs.Form;
using FormBuilder.Core.DTOs.Submission;
using FormBuilder.Message;

namespace FormBuilder.Service.Interface;

public interface IPublicFormService
{
    Task<ApiResponse<PublicFormDto>> GetPublicFormAsync(string formId);
    Task<ApiResponse> IncrementViewAsync(string formId);
    Task<ApiResponse> IncrementStartAsync(string formId);
    Task<ApiResponse<SubmissionResponseDto>> SubmitAsync(string formId, SubmissionRequestDto dto, string? ip, string? userAgent);
}

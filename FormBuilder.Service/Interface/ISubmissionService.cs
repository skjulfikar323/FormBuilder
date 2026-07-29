using FormBuilder.Core.DTOs.Submission;
using FormBuilder.Message;

namespace FormBuilder.Service.Interface;

public interface ISubmissionService
{
    Task<ApiResponse<SubmissionsListResponseDto>> GetForFormAsync(string userId, string formId);
    Task<ApiResponse> DeleteAsync(string userId, string formId, string submissionId);
}

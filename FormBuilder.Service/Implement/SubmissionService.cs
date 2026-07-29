using AutoMapper;
using FormBuilder.Core.DTOs.Submission;
using FormBuilder.Data.Interface;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using FormBuilder.Utilities;

namespace FormBuilder.Service.Implement;

public class SubmissionService : ISubmissionService
{
    private readonly IFormRepository _formRepo;
    private readonly ISubmissionRepository _subRepo;
    private readonly IMapper _mapper;

    public SubmissionService(
        IFormRepository formRepo,
        ISubmissionRepository subRepo,
        IMapper mapper)
    {
        _formRepo = formRepo;
        _subRepo = subRepo;
        _mapper = mapper;
    }

    public async Task<ApiResponse<SubmissionsListResponseDto>> GetForFormAsync(string userId, string formId)
    {
        if (!formId.IsValidObjectId())
            return ApiResponse<SubmissionsListResponseDto>.Fail(ErrorMessages.FormNotFound);

        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null || form.UserId != userId)
            return ApiResponse<SubmissionsListResponseDto>.Fail(ErrorMessages.FormNotFound);

        var subs = await _subRepo.GetByFormAsync(formId, limit: 500);
        var response = new SubmissionsListResponseDto
        {
            Form = new FormStatsDto
            {
                Id = form.Id,
                Views = form.Views,
                Starts = form.Starts,
                SubmissionCount = form.SubmissionCount
            },
            Submissions = subs.Select(s => new SubmissionResponseDto
            {
                Id = s.Id,
                SubmittedAt = s.SubmittedAt,
                Values = s.Values.ToJsonElement()
            }).ToList()
        };
        return ApiResponse<SubmissionsListResponseDto>.Ok(response);
    }

    public async Task<ApiResponse> DeleteAsync(string userId, string formId, string submissionId)
    {
        if (!formId.IsValidObjectId() || !submissionId.IsValidObjectId())
            return ApiResponse.Fail(ErrorMessages.SubmissionNotFound);

        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null || form.UserId != userId)
            return ApiResponse.Fail(ErrorMessages.FormNotFound);

        var sub = await _subRepo.GetByIdAsync(submissionId);
        if (sub == null || sub.FormId != formId)
            return ApiResponse.Fail(ErrorMessages.SubmissionNotFound);

        await _subRepo.DeleteAsync(submissionId);
        await _formRepo.IncrementSubmissionCountAsync(formId, delta: -1);
        return ApiResponse.Ok(SuccessMessages.SubmissionDeleted);
    }
}

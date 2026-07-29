using System.Text.Json;
using FormBuilder.Core.DTOs.Form;
using FormBuilder.Core.DTOs.Submission;
using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using FormBuilder.Utilities;

namespace FormBuilder.Service.Implement;

public class PublicFormService : IPublicFormService
{
    private readonly IFormRepository _formRepo;
    private readonly ISubmissionRepository _subRepo;

    public PublicFormService(IFormRepository formRepo, ISubmissionRepository subRepo)
    {
        _formRepo = formRepo;
        _subRepo = subRepo;
    }

    public async Task<ApiResponse<PublicFormDto>> GetPublicFormAsync(string formId)
    {
        if (!formId.IsValidObjectId())
            return ApiResponse<PublicFormDto>.Fail(ErrorMessages.FormNotFound);

        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null)
            return ApiResponse<PublicFormDto>.Fail(ErrorMessages.FormNotFound);

        var dto = new PublicFormDto
        {
            Id = form.Id,
            Name = form.Name,
            ThemeId = form.ThemeId,
            Blocks = form.Blocks.Select(b => new BlockDto
            {
                Id = b.Id,
                Type = b.Type,
                Data = b.Data.ToJsonElement()
            }).ToList()
        };
        return ApiResponse<PublicFormDto>.Ok(dto);
    }

    public async Task<ApiResponse> IncrementViewAsync(string formId)
    {
        if (!formId.IsValidObjectId())
            return ApiResponse.Fail(ErrorMessages.FormNotFound);
        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null)
            return ApiResponse.Fail(ErrorMessages.FormNotFound);
        await _formRepo.IncrementViewsAsync(formId);
        return ApiResponse.Ok();
    }

    public async Task<ApiResponse> IncrementStartAsync(string formId)
    {
        if (!formId.IsValidObjectId())
            return ApiResponse.Fail(ErrorMessages.FormNotFound);
        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null)
            return ApiResponse.Fail(ErrorMessages.FormNotFound);
        await _formRepo.IncrementStartsAsync(formId);
        return ApiResponse.Ok();
    }

    public async Task<ApiResponse<SubmissionResponseDto>> SubmitAsync(string formId, SubmissionRequestDto dto, string? ip, string? userAgent)
    {
        if (!formId.IsValidObjectId())
            return ApiResponse<SubmissionResponseDto>.Fail(ErrorMessages.FormNotFound);

        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null)
            return ApiResponse<SubmissionResponseDto>.Fail(ErrorMessages.FormNotFound);

        // Validate: every required input block must have a value
        var errors = new Dictionary<string, List<string>>();
        JsonElement values = dto.Values;

        foreach (var block in form.Blocks.Where(b => b.Type.EndsWith("-input")))
        {
            var required = block.Data.Contains("required") && block.Data["required"].AsBoolean;
            var hasValue = false;
            JsonElement value = default;

            if (values.ValueKind == JsonValueKind.Object && values.TryGetProperty(block.Id, out var v))
            {
                value = v;
                hasValue = v.ValueKind != JsonValueKind.Null && v.ValueKind != JsonValueKind.Undefined &&
                           !(v.ValueKind == JsonValueKind.String && string.IsNullOrWhiteSpace(v.GetString()));
            }

            if (required && !hasValue)
            {
                errors[block.Id] = new List<string> { "Required field" };
                continue;
            }

            if (!hasValue) continue;

            // Type-specific validation
            if (block.Type == "email-input" && value.ValueKind == JsonValueKind.String)
            {
                if (!value.GetString().IsValidEmail())
                    errors[block.Id] = new List<string> { "Enter a valid email address." };
            }
            else if (block.Type == "number-input" && value.ValueKind == JsonValueKind.String)
            {
                if (!double.TryParse(value.GetString(), out _))
                    errors[block.Id] = new List<string> { "Enter a valid number." };
            }
            else if (block.Type == "rating-input")
            {
                int max = block.Data.Contains("max") ? block.Data["max"].AsInt32 : 5;
                if (value.ValueKind == JsonValueKind.Number)
                {
                    var num = value.GetInt32();
                    if (num < 1 || num > max)
                        errors[block.Id] = new List<string> { $"Rating must be between 1 and {max}." };
                }
            }
        }

        if (errors.Count > 0)
            return ApiResponse<SubmissionResponseDto>.Fail(ErrorMessages.ValidationFailed, errors);

        var submission = new Submission
        {
            FormId = formId,
            Values = values.ToBsonDocument(),
            SubmittedAt = DateTime.UtcNow,
            IpAddress = ip,
            UserAgent = userAgent
        };
        await _subRepo.InsertAsync(submission);
        await _formRepo.IncrementSubmissionCountAsync(formId, delta: 1);
        AppLogger.Info("Submission {SubId} for form {FormId}", submission.Id, formId);

        return ApiResponse<SubmissionResponseDto>.Ok(new SubmissionResponseDto
        {
            Id = submission.Id,
            SubmittedAt = submission.SubmittedAt,
            Values = submission.Values.ToJsonElement()
        }, SuccessMessages.SubmissionCreated);
    }
}

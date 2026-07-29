using AutoMapper;
using FormBuilder.Core.Constants;
using FormBuilder.Core.DTOs.Form;
using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using FormBuilder.Utilities;

namespace FormBuilder.Service.Implement;

public class FormService : IFormService
{
    private readonly IFormRepository _formRepo;
    private readonly IFolderRepository _folderRepo;
    private readonly ISubmissionRepository _subRepo;
    private readonly IMapper _mapper;

    public FormService(
        IFormRepository formRepo,
        IFolderRepository folderRepo,
        ISubmissionRepository subRepo,
        IMapper mapper)
    {
        _formRepo = formRepo;
        _folderRepo = folderRepo;
        _subRepo = subRepo;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<FormListItemDto>>> GetMyFormsAsync(string userId, string? folderId)
    {
        // "null" or empty string ⇒ root-level filter. Any other value ⇒ specific folder.
        string? filter = string.IsNullOrWhiteSpace(folderId) || folderId == "null" ? null : folderId;
        // But if the client explicitly passes ?folderId=null, they want root-only.
        // Distinguish "no filter" (all forms) vs "root-only" via query key presence in controller.
        var forms = await _formRepo.GetByUserAsync(userId, filter);
        var dto = _mapper.Map<List<FormListItemDto>>(forms);
        return ApiResponse<List<FormListItemDto>>.Ok(dto);
    }

    public async Task<ApiResponse<FormResponseDto>> GetByIdAsync(string userId, string formId)
    {
        if (!formId.IsValidObjectId())
            return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FormNotFound);

        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null || form.UserId != userId)
            return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FormNotFound);

        return ApiResponse<FormResponseDto>.Ok(_mapper.Map<FormResponseDto>(form));
    }

    public async Task<ApiResponse<FormResponseDto>> CreateAsync(string userId, CreateFormRequestDto dto)
    {
        var name = dto.Name.SafeTrim();
        if (string.IsNullOrWhiteSpace(name))
            return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FormNameRequired);

        // Validate folder ownership if provided
        if (!string.IsNullOrWhiteSpace(dto.FolderId))
        {
            if (!dto.FolderId.IsValidObjectId())
                return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FolderNotFound);
            if (!await _folderRepo.BelongsToUserAsync(dto.FolderId, userId))
                return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FolderNotFound);
        }

        var form = new Form
        {
            UserId = userId,
            FolderId = string.IsNullOrWhiteSpace(dto.FolderId) ? null : dto.FolderId,
            Name = name,
            ThemeId = AppConstants.Themes.Light,
            Blocks = new List<Block>(),
            Views = 0,
            Starts = 0,
            SubmissionCount = 0,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _formRepo.InsertAsync(form);
        AppLogger.Info("Form created {FormId} for {UserId}", form.Id, userId);
        return ApiResponse<FormResponseDto>.Ok(_mapper.Map<FormResponseDto>(form), SuccessMessages.FormCreated);
    }

    public async Task<ApiResponse<FormResponseDto>> UpdateAsync(string userId, string formId, UpdateFormRequestDto dto)
    {
        if (!formId.IsValidObjectId())
            return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FormNotFound);

        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null || form.UserId != userId)
            return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FormNotFound);

        if (!string.IsNullOrWhiteSpace(dto.Name))
            form.Name = dto.Name.SafeTrim();

        if (dto.FolderId != null)
        {
            if (dto.FolderId == string.Empty)
                form.FolderId = null;
            else
            {
                if (!dto.FolderId.IsValidObjectId())
                    return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FolderNotFound);
                if (!await _folderRepo.BelongsToUserAsync(dto.FolderId, userId))
                    return ApiResponse<FormResponseDto>.Fail(ErrorMessages.FolderNotFound);
                form.FolderId = dto.FolderId;
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.ThemeId))
        {
            if (!AppConstants.Themes.All.Contains(dto.ThemeId))
                return ApiResponse<FormResponseDto>.Fail(ErrorMessages.InvalidThemeId);
            form.ThemeId = dto.ThemeId;
        }

        if (dto.Blocks != null)
        {
            var validated = new List<Block>();
            foreach (var b in dto.Blocks)
            {
                if (string.IsNullOrWhiteSpace(b.Type) || !AppConstants.BlockTypes.All.Contains(b.Type))
                    return ApiResponse<FormResponseDto>.Fail(ErrorMessages.InvalidBlockType);
                validated.Add(new Block
                {
                    Id = string.IsNullOrWhiteSpace(b.Id) ? Guid.NewGuid().ToString("N")[..12] : b.Id,
                    Type = b.Type,
                    Data = b.Data.ToBsonDocument()
                });
            }
            form.Blocks = validated;
        }

        form.UpdatedAt = DateTime.UtcNow;
        await _formRepo.UpdateAsync(form);
        return ApiResponse<FormResponseDto>.Ok(_mapper.Map<FormResponseDto>(form), SuccessMessages.FormUpdated);
    }

    public async Task<ApiResponse> DeleteAsync(string userId, string formId)
    {
        if (!formId.IsValidObjectId())
            return ApiResponse.Fail(ErrorMessages.FormNotFound);

        var form = await _formRepo.GetByIdAsync(formId);
        if (form == null || form.UserId != userId)
            return ApiResponse.Fail(ErrorMessages.FormNotFound);

        await _subRepo.DeleteByFormAsync(formId);
        await _formRepo.DeleteAsync(formId);
        AppLogger.Info("Form {FormId} deleted", formId);
        return ApiResponse.Ok(SuccessMessages.FormDeleted);
    }
}

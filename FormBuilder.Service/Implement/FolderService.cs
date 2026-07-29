using AutoMapper;
using FormBuilder.Core.DTOs.Folder;
using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using FormBuilder.Message;
using FormBuilder.Service.Interface;
using FormBuilder.Utilities;

namespace FormBuilder.Service.Implement;

public class FolderService : IFolderService
{
    private readonly IFolderRepository _folderRepo;
    private readonly IFormRepository _formRepo;
    private readonly ISubmissionRepository _subRepo;
    private readonly IMapper _mapper;

    public FolderService(
        IFolderRepository folderRepo,
        IFormRepository formRepo,
        ISubmissionRepository subRepo,
        IMapper mapper)
    {
        _folderRepo = folderRepo;
        _formRepo = formRepo;
        _subRepo = subRepo;
        _mapper = mapper;
    }

    public async Task<ApiResponse<List<FolderResponseDto>>> GetMyFoldersAsync(string userId)
    {
        var folders = await _folderRepo.GetByUserAsync(userId);
        return ApiResponse<List<FolderResponseDto>>.Ok(_mapper.Map<List<FolderResponseDto>>(folders));
    }

    public async Task<ApiResponse<FolderResponseDto>> CreateAsync(string userId, CreateFolderRequestDto dto)
    {
        var name = dto.Name.SafeTrim();
        if (string.IsNullOrWhiteSpace(name))
            return ApiResponse<FolderResponseDto>.Fail(ErrorMessages.FolderNameRequired);
        if (name.Length > 100)
            return ApiResponse<FolderResponseDto>.Fail("Folder name must be 100 characters or less.");

        var folder = new Folder
        {
            UserId = userId,
            Name = name,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };
        await _folderRepo.InsertAsync(folder);
        AppLogger.Info("Folder created {FolderId} for {UserId}", folder.Id, userId);
        return ApiResponse<FolderResponseDto>.Ok(_mapper.Map<FolderResponseDto>(folder), SuccessMessages.FolderCreated);
    }

    public async Task<ApiResponse<FolderResponseDto>> RenameAsync(string userId, string folderId, RenameFolderRequestDto dto)
    {
        if (!folderId.IsValidObjectId())
            return ApiResponse<FolderResponseDto>.Fail(ErrorMessages.FolderNotFound);

        var folder = await _folderRepo.GetByIdAsync(folderId);
        if (folder == null || folder.UserId != userId)
            return ApiResponse<FolderResponseDto>.Fail(ErrorMessages.FolderNotFound);

        var name = dto.Name.SafeTrim();
        if (string.IsNullOrWhiteSpace(name))
            return ApiResponse<FolderResponseDto>.Fail(ErrorMessages.FolderNameRequired);

        folder.Name = name;
        folder.UpdatedAt = DateTime.UtcNow;
        await _folderRepo.UpdateAsync(folder);
        return ApiResponse<FolderResponseDto>.Ok(_mapper.Map<FolderResponseDto>(folder), SuccessMessages.FolderRenamed);
    }

    public async Task<ApiResponse> DeleteAsync(string userId, string folderId)
    {
        if (!folderId.IsValidObjectId())
            return ApiResponse.Fail(ErrorMessages.FolderNotFound);

        var folder = await _folderRepo.GetByIdAsync(folderId);
        if (folder == null || folder.UserId != userId)
            return ApiResponse.Fail(ErrorMessages.FolderNotFound);

        // Cascade: delete forms + their submissions
        var forms = await _formRepo.GetByUserAsync(userId, folderId);
        var formIds = forms.Select(f => f.Id).ToList();
        if (formIds.Count > 0)
            await _subRepo.DeleteByFormsAsync(formIds);
        await _formRepo.DeleteByFolderAsync(folderId);
        await _folderRepo.DeleteAsync(folderId);
        AppLogger.Info("Folder {FolderId} deleted (cascaded {FormCount} forms)", folderId, formIds.Count);
        return ApiResponse.Ok(SuccessMessages.FolderDeleted);
    }
}

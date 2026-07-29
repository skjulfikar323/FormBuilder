using FormBuilder.Core.DTOs.Folder;
using FormBuilder.Message;

namespace FormBuilder.Service.Interface;

public interface IFolderService
{
    Task<ApiResponse<List<FolderResponseDto>>> GetMyFoldersAsync(string userId);
    Task<ApiResponse<FolderResponseDto>> CreateAsync(string userId, CreateFolderRequestDto dto);
    Task<ApiResponse<FolderResponseDto>> RenameAsync(string userId, string folderId, RenameFolderRequestDto dto);
    Task<ApiResponse> DeleteAsync(string userId, string folderId);
}

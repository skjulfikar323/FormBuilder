using FormBuilder.Core.Models;

namespace FormBuilder.Data.Interface;

public interface IFolderRepository
{
    Task<List<Folder>> GetByUserAsync(string userId);
    Task<Folder?> GetByIdAsync(string id);
    Task InsertAsync(Folder folder);
    Task UpdateAsync(Folder folder);
    Task DeleteAsync(string id);
    Task<bool> BelongsToUserAsync(string folderId, string userId);
}

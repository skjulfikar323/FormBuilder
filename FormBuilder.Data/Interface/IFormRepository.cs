using FormBuilder.Core.Models;

namespace FormBuilder.Data.Interface;

public interface IFormRepository
{
    Task<List<Form>> GetByUserAsync(string userId, string? folderId = null);
    Task<Form?> GetByIdAsync(string id);
    Task InsertAsync(Form form);
    Task UpdateAsync(Form form);
    Task DeleteAsync(string id);
    Task DeleteByFolderAsync(string folderId);
    Task DeleteByUserAsync(string userId);
    Task IncrementViewsAsync(string formId);
    Task IncrementStartsAsync(string formId);
    Task IncrementSubmissionCountAsync(string formId, int delta = 1);
}

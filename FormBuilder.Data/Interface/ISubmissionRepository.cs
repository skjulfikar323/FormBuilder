using FormBuilder.Core.Models;

namespace FormBuilder.Data.Interface;

public interface ISubmissionRepository
{
    Task<List<Submission>> GetByFormAsync(string formId, int limit = 100);
    Task<Submission?> GetByIdAsync(string id);
    Task InsertAsync(Submission submission);
    Task DeleteAsync(string id);
    Task DeleteByFormAsync(string formId);
    Task DeleteByFormsAsync(IEnumerable<string> formIds);
}

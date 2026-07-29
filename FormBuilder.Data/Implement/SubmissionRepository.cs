using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using MongoDB.Driver;

namespace FormBuilder.Data.Implement;

public class SubmissionRepository : ISubmissionRepository
{
    private readonly AppDbContext _db;
    public SubmissionRepository(AppDbContext db) => _db = db;

    public async Task<List<Submission>> GetByFormAsync(string formId, int limit = 100) =>
        await _db.Submissions
            .Find(s => s.FormId == formId)
            .SortByDescending(s => s.SubmittedAt)
            .Limit(limit)
            .ToListAsync();

    public Task<Submission?> GetByIdAsync(string id) =>
        _db.Submissions.Find(s => s.Id == id).FirstOrDefaultAsync()!;

    public Task InsertAsync(Submission submission) =>
        _db.Submissions.InsertOneAsync(submission);

    public Task DeleteAsync(string id) =>
        _db.Submissions.DeleteOneAsync(s => s.Id == id);

    public Task DeleteByFormAsync(string formId) =>
        _db.Submissions.DeleteManyAsync(s => s.FormId == formId);

    public Task DeleteByFormsAsync(IEnumerable<string> formIds) =>
        _db.Submissions.DeleteManyAsync(s => formIds.Contains(s.FormId));
}

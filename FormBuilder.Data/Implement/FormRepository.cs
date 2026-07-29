using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using MongoDB.Driver;

namespace FormBuilder.Data.Implement;

public class FormRepository : IFormRepository
{
    private readonly AppDbContext _db;
    public FormRepository(AppDbContext db) => _db = db;

    public async Task<List<Form>> GetByUserAsync(string userId, string? folderId = null)
    {
        var filter = Builders<Form>.Filter.Eq(f => f.UserId, userId);
        if (folderId != null)
            filter &= Builders<Form>.Filter.Eq(f => f.FolderId, folderId);

        return await _db.Forms
            .Find(filter)
            .SortByDescending(f => f.UpdatedAt)
            .ToListAsync();
    }

    public Task<Form?> GetByIdAsync(string id) =>
        _db.Forms.Find(f => f.Id == id).FirstOrDefaultAsync()!;

    public Task InsertAsync(Form form) => _db.Forms.InsertOneAsync(form);

    public Task UpdateAsync(Form form) =>
        _db.Forms.ReplaceOneAsync(f => f.Id == form.Id, form);

    public Task DeleteAsync(string id) =>
        _db.Forms.DeleteOneAsync(f => f.Id == id);

    public Task DeleteByFolderAsync(string folderId) =>
        _db.Forms.DeleteManyAsync(f => f.FolderId == folderId);

    public Task DeleteByUserAsync(string userId) =>
        _db.Forms.DeleteManyAsync(f => f.UserId == userId);

    public Task IncrementViewsAsync(string formId) =>
        _db.Forms.UpdateOneAsync(
            f => f.Id == formId,
            Builders<Form>.Update.Inc(f => f.Views, 1));

    public Task IncrementStartsAsync(string formId) =>
        _db.Forms.UpdateOneAsync(
            f => f.Id == formId,
            Builders<Form>.Update.Inc(f => f.Starts, 1));

    public Task IncrementSubmissionCountAsync(string formId, int delta = 1) =>
        _db.Forms.UpdateOneAsync(
            f => f.Id == formId,
            Builders<Form>.Update.Inc(f => f.SubmissionCount, delta));
}

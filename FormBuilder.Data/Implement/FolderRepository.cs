using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using MongoDB.Driver;

namespace FormBuilder.Data.Implement;

public class FolderRepository : IFolderRepository
{
    private readonly AppDbContext _db;
    public FolderRepository(AppDbContext db) => _db = db;

    public async Task<List<Folder>> GetByUserAsync(string userId) =>
        await _db.Folders
            .Find(f => f.UserId == userId)
            .SortByDescending(f => f.CreatedAt)
            .ToListAsync();

    public Task<Folder?> GetByIdAsync(string id) =>
        _db.Folders.Find(f => f.Id == id).FirstOrDefaultAsync()!;

    public Task InsertAsync(Folder folder) => _db.Folders.InsertOneAsync(folder);

    public Task UpdateAsync(Folder folder) =>
        _db.Folders.ReplaceOneAsync(f => f.Id == folder.Id, folder);

    public Task DeleteAsync(string id) =>
        _db.Folders.DeleteOneAsync(f => f.Id == id);

    public async Task<bool> BelongsToUserAsync(string folderId, string userId) =>
        await _db.Folders.Find(f => f.Id == folderId && f.UserId == userId).AnyAsync();
}

using FormBuilder.Core.Models;
using FormBuilder.Data.Interface;
using MongoDB.Driver;

namespace FormBuilder.Data.Implement;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;
    public UserRepository(AppDbContext db) => _db = db;

    public Task<User?> GetByIdAsync(string id) =>
        _db.Users.Find(u => u.Id == id).FirstOrDefaultAsync()!;

    public Task<User?> GetByEmailAsync(string email) =>
        _db.Users.Find(u => u.Email == email.ToLowerInvariant()).FirstOrDefaultAsync()!;

    public Task<User?> GetByUsernameAsync(string username) =>
        _db.Users.Find(u => u.Username == username).FirstOrDefaultAsync()!;

    public async Task<bool> ExistsByEmailAsync(string email) =>
        await _db.Users.Find(u => u.Email == email.ToLowerInvariant()).AnyAsync();

    public async Task<bool> ExistsByUsernameAsync(string username) =>
        await _db.Users.Find(u => u.Username == username).AnyAsync();

    public Task InsertAsync(User user) => _db.Users.InsertOneAsync(user);

    public Task UpdateAsync(User user) =>
        _db.Users.ReplaceOneAsync(u => u.Id == user.Id, user);

    public Task DeleteAsync(string id) =>
        _db.Users.DeleteOneAsync(u => u.Id == id);
}

using FormBuilder.Core.Models;

namespace FormBuilder.Data.Interface;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(string id);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByUsernameAsync(string username);
    Task<bool> ExistsByEmailAsync(string email);
    Task<bool> ExistsByUsernameAsync(string username);
    Task InsertAsync(User user);
    Task UpdateAsync(User user);
    Task DeleteAsync(string id);
}

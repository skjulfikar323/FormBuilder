using FormBuilder.Core.Models;

namespace FormBuilder.Service.Interface;

public interface IJwtService
{
    string GenerateToken(User user);
}

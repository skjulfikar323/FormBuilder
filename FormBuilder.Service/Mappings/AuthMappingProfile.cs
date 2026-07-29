using AutoMapper;
using FormBuilder.Core.DTOs.User;
using FormBuilder.Core.Models;

namespace FormBuilder.Service.Mappings;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        CreateMap<User, UserResponseDto>();
        CreateMap<UserPreferences, UserPreferencesDto>();
    }
}

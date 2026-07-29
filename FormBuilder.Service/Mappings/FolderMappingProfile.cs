using AutoMapper;
using FormBuilder.Core.DTOs.Folder;
using FormBuilder.Core.Models;

namespace FormBuilder.Service.Mappings;

public class FolderMappingProfile : Profile
{
    public FolderMappingProfile()
    {
        CreateMap<Folder, FolderResponseDto>();
    }
}

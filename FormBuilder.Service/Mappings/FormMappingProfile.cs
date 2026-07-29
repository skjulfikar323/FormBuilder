using AutoMapper;
using FormBuilder.Core.DTOs.Form;
using FormBuilder.Core.Models;
using FormBuilder.Utilities;

namespace FormBuilder.Service.Mappings;

public class FormMappingProfile : Profile
{
    public FormMappingProfile()
    {
        CreateMap<Block, BlockDto>()
            .ForMember(dest => dest.Data, opt => opt.MapFrom(src => src.Data.ToJsonElement()));

        CreateMap<Form, FormResponseDto>();
        CreateMap<Form, FormListItemDto>();

        CreateMap<Form, PublicFormDto>();
    }
}

using FormBuilder.Service.Config;
using FormBuilder.Service.Implement;
using FormBuilder.Service.Interface;
using FormBuilder.Service.Mappings;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FormBuilder.Service;

public static class DependencyInjection
{
    public static IServiceCollection AddServiceLayer(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection("Jwt"));
        services.Configure<CorsSettings>(configuration.GetSection("Cors"));

        services.AddAutoMapper(cfg =>
        {
            cfg.AddProfile<AuthMappingProfile>();
            cfg.AddProfile<FolderMappingProfile>();
            cfg.AddProfile<FormMappingProfile>();
        });

        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IFolderService, FolderService>();
        services.AddScoped<IFormService, FormService>();
        services.AddScoped<ISubmissionService, SubmissionService>();
        services.AddScoped<IPublicFormService, PublicFormService>();

        return services;
    }
}

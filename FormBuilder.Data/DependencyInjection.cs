using FormBuilder.Data.Implement;
using FormBuilder.Data.Interface;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace FormBuilder.Data;

public static class DependencyInjection
{
    public static IServiceCollection AddDataLayer(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<MongoDbSettings>(configuration.GetSection("MongoDb"));
        services.AddSingleton<AppDbContext>();

        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IFolderRepository, FolderRepository>();
        services.AddScoped<IFormRepository, FormRepository>();
        services.AddScoped<ISubmissionRepository, SubmissionRepository>();

        return services;
    }
}

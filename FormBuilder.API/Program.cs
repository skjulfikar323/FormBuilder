using System.Text;
using FormBuilder.API.Middleware;
using FormBuilder.Data;
using FormBuilder.Data.Helper;
using FormBuilder.Service;
using FormBuilder.Service.Config;
using FormBuilder.Utilities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Serilog;

// -------- Bootstrap Serilog --------
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/formbuilder-.log", rollingInterval: RollingInterval.Day)
    .Enrich.FromLogContext()
    .CreateLogger();

try
{
    AppLogger.Info("Starting FormBuilder.API");
    var builder = WebApplication.CreateBuilder(args);

    builder.Host.UseSerilog();

    // -------- Layers --------
    builder.Services.AddDataLayer(builder.Configuration);
    builder.Services.AddServiceLayer(builder.Configuration);

    // -------- Web --------
    builder.Services.AddControllers();
    builder.Services.AddEndpointsApiExplorer();

    // -------- Swagger + JWT --------
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo
        {
            Title = "FormBuilder API",
            Version = "v1",
            Description = "Backend API for FormBuilder (N-Tier + MongoDB + JWT)."
        });
        c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.ApiKey,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Enter: Bearer <your JWT token>"
        });
        c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                Array.Empty<string>()
            }
        });
    });

    // -------- Authentication --------
    var jwtSection = builder.Configuration.GetSection("Jwt");
    var jwtSettings = jwtSection.Get<JwtSettings>() ?? new JwtSettings();
    builder.Services
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings.Issuer,
                ValidAudience = jwtSettings.Audience,
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(jwtSettings.Secret ?? string.Empty)),
                ClockSkew = TimeSpan.FromSeconds(30)
            };
        });
    builder.Services.AddAuthorization();

    // -------- CORS --------
    var corsSettings = builder.Configuration.GetSection("Cors").Get<CorsSettings>() ?? new CorsSettings();
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("frontend", policy =>
        {
            if (corsSettings.AllowedOrigins.Length == 0)
                policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
            else
                policy.WithOrigins(corsSettings.AllowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
        });
    });

    var app = builder.Build();

    // -------- Ensure MongoDB indexes on startup --------
    using (var scope = app.Services.CreateScope())
    {
        try
        {
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            await MongoIndexHelper.EnsureIndexesAsync(db);
            AppLogger.Info("MongoDB indexes ensured");
        }
        catch (Exception ex)
        {
            AppLogger.Error(ex, "Failed to ensure MongoDB indexes (backend may still start if DB is offline)");
        }
    }

    // -------- Pipeline --------
    app.UseMiddleware<ExceptionHandlingMiddleware>();
    app.UseSerilogRequestLogging();

    if (app.Environment.IsDevelopment())
    {
        app.UseSwagger();
        app.UseSwaggerUI(c =>
        {
            c.SwaggerEndpoint("/swagger/v1/swagger.json", "FormBuilder API v1");
            c.RoutePrefix = "swagger";
        });
    }

    app.UseCors("frontend");
    app.UseAuthentication();
    app.UseAuthorization();
    app.MapControllers();

    AppLogger.Info("FormBuilder.API ready");
    app.Run();
}
catch (Exception ex)
{
    AppLogger.Error(ex, "FormBuilder.API failed to start");
    throw;
}
finally
{
    Log.CloseAndFlush();
}

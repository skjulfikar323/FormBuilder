using FormBuilder.Core.Constants;
using FormBuilder.Core.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace FormBuilder.Data;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
}

public class AppDbContext
{
    public IMongoDatabase Database { get; }

    public IMongoCollection<User> Users { get; }
    public IMongoCollection<Folder> Folders { get; }
    public IMongoCollection<Form> Forms { get; }
    public IMongoCollection<Submission> Submissions { get; }

    public AppDbContext(IOptions<MongoDbSettings> options)
    {
        var settings = options.Value;
        var client = new MongoClient(settings.ConnectionString);
        Database = client.GetDatabase(settings.DatabaseName);

        Users = Database.GetCollection<User>(AppConstants.Collections.Users);
        Folders = Database.GetCollection<Folder>(AppConstants.Collections.Folders);
        Forms = Database.GetCollection<Form>(AppConstants.Collections.Forms);
        Submissions = Database.GetCollection<Submission>(AppConstants.Collections.Submissions);
    }
}

using FormBuilder.Core.Models;
using MongoDB.Driver;

namespace FormBuilder.Data.Helper;

public static class MongoIndexHelper
{
    public static async Task EnsureIndexesAsync(AppDbContext db)
    {
        // Users: unique email + username
        await db.Users.Indexes.CreateManyAsync(new[]
        {
            new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Email),
                new CreateIndexOptions { Unique = true, Name = "ux_email" }),
            new CreateIndexModel<User>(
                Builders<User>.IndexKeys.Ascending(u => u.Username),
                new CreateIndexOptions { Unique = true, Name = "ux_username" })
        });

        // Folders: userId + createdAt
        await db.Folders.Indexes.CreateOneAsync(
            new CreateIndexModel<Folder>(
                Builders<Folder>.IndexKeys
                    .Ascending(f => f.UserId)
                    .Descending(f => f.CreatedAt),
                new CreateIndexOptions { Name = "ix_folder_user_created" }));

        // Forms: userId + folderId + createdAt, and userId + updatedAt
        await db.Forms.Indexes.CreateManyAsync(new[]
        {
            new CreateIndexModel<Form>(
                Builders<Form>.IndexKeys
                    .Ascending(f => f.UserId)
                    .Ascending(f => f.FolderId)
                    .Descending(f => f.CreatedAt),
                new CreateIndexOptions { Name = "ix_form_user_folder_created" }),
            new CreateIndexModel<Form>(
                Builders<Form>.IndexKeys
                    .Ascending(f => f.UserId)
                    .Descending(f => f.UpdatedAt),
                new CreateIndexOptions { Name = "ix_form_user_updated" })
        });

        // Submissions: formId + submittedAt
        await db.Submissions.Indexes.CreateOneAsync(
            new CreateIndexModel<Submission>(
                Builders<Submission>.IndexKeys
                    .Ascending(s => s.FormId)
                    .Descending(s => s.SubmittedAt),
                new CreateIndexOptions { Name = "ix_sub_form_time" }));
    }
}

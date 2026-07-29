using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FormBuilder.Core.Models;

public class Form
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("userId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string UserId { get; set; } = string.Empty;

    [BsonElement("folderId")]
    [BsonRepresentation(BsonType.ObjectId)]
    [BsonIgnoreIfNull]
    public string? FolderId { get; set; }

    [BsonElement("name")]
    public string Name { get; set; } = string.Empty;

    [BsonElement("themeId")]
    public string ThemeId { get; set; } = "light";

    [BsonElement("blocks")]
    public List<Block> Blocks { get; set; } = new();

    [BsonElement("views")]
    public int Views { get; set; }

    [BsonElement("starts")]
    public int Starts { get; set; }

    [BsonElement("submissionCount")]
    public int SubmissionCount { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

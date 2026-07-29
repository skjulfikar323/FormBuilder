using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FormBuilder.Core.Models;

public class Submission
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("formId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string FormId { get; set; } = string.Empty;

    [BsonElement("values")]
    public BsonDocument Values { get; set; } = new();

    [BsonElement("submittedAt")]
    public DateTime SubmittedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("ipAddress")]
    [BsonIgnoreIfNull]
    public string? IpAddress { get; set; }

    [BsonElement("userAgent")]
    [BsonIgnoreIfNull]
    public string? UserAgent { get; set; }
}

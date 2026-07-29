using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace FormBuilder.Core.Models;

public class Block
{
    [BsonElement("id")]
    public string Id { get; set; } = string.Empty;

    [BsonElement("type")]
    public string Type { get; set; } = string.Empty;

    [BsonElement("data")]
    [BsonExtraElements]
    public BsonDocument Data { get; set; } = new();
}

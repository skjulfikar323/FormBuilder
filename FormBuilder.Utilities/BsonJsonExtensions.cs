using System.Text.Json;
using MongoDB.Bson;
using MongoDB.Bson.IO;

namespace FormBuilder.Utilities;

public static class BsonJsonExtensions
{
    private static readonly JsonWriterSettings _relaxed = new()
    {
        OutputMode = JsonOutputMode.RelaxedExtendedJson
    };

    public static BsonDocument ToBsonDocument(this JsonElement element)
    {
        if (element.ValueKind == JsonValueKind.Undefined || element.ValueKind == JsonValueKind.Null)
            return new BsonDocument();
        return BsonDocument.Parse(element.GetRawText());
    }

    public static JsonElement ToJsonElement(this BsonDocument bson)
    {
        if (bson == null || bson.ElementCount == 0)
        {
            using var empty = JsonDocument.Parse("{}");
            return empty.RootElement.Clone();
        }
        var json = bson.ToJson(_relaxed);
        using var doc = JsonDocument.Parse(json);
        return doc.RootElement.Clone();
    }
}

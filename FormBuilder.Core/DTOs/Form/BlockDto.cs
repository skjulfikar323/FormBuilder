using System.Text.Json;

namespace FormBuilder.Core.DTOs.Form;

public class BlockDto
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public JsonElement Data { get; set; }
}

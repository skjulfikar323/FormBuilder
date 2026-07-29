namespace FormBuilder.Core.DTOs.Form;

public class CreateFormRequestDto
{
    public string Name { get; set; } = string.Empty;
    public string? FolderId { get; set; }
}

public class UpdateFormRequestDto
{
    public string? Name { get; set; }
    public string? FolderId { get; set; }
    public string? ThemeId { get; set; }
    public List<BlockDto>? Blocks { get; set; }
}

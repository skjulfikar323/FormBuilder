namespace FormBuilder.Core.DTOs.Form;

public class FormResponseDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? FolderId { get; set; }
    public string ThemeId { get; set; } = "light";
    public List<BlockDto> Blocks { get; set; } = new();
    public int Views { get; set; }
    public int Starts { get; set; }
    public int SubmissionCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class FormListItemDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? FolderId { get; set; }
    public string ThemeId { get; set; } = "light";
    public int Views { get; set; }
    public int SubmissionCount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class PublicFormDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ThemeId { get; set; } = "light";
    public List<BlockDto> Blocks { get; set; } = new();
}

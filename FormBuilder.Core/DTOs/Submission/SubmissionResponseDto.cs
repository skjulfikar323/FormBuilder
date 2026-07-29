using System.Text.Json;

namespace FormBuilder.Core.DTOs.Submission;

public class SubmissionResponseDto
{
    public string Id { get; set; } = string.Empty;
    public JsonElement Values { get; set; }
    public DateTime SubmittedAt { get; set; }
}

public class SubmissionsListResponseDto
{
    public FormStatsDto Form { get; set; } = new();
    public List<SubmissionResponseDto> Submissions { get; set; } = new();
}

public class FormStatsDto
{
    public string Id { get; set; } = string.Empty;
    public int Views { get; set; }
    public int Starts { get; set; }
    public int SubmissionCount { get; set; }
}

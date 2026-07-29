using System.Text.Json;

namespace FormBuilder.Core.DTOs.Submission;

public class SubmissionRequestDto
{
    public JsonElement Values { get; set; }
}

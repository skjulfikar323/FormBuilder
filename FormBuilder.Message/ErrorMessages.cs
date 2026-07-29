namespace FormBuilder.Message;

public static class ErrorMessages
{
    // Auth
    public const string InvalidCredentials = "Invalid email or password.";
    public const string EmailAlreadyRegistered = "An account with this email already exists.";
    public const string UsernameAlreadyTaken = "This username is already taken.";
    public const string CurrentPasswordIncorrect = "Current password is incorrect.";
    public const string PasswordTooShort = "Password must be at least 8 characters long.";
    public const string NewPasswordMustDiffer = "New password must be different from the current one.";
    public const string Unauthorized = "You must be logged in to perform this action.";
    public const string Forbidden = "You do not have permission to perform this action.";

    // Users
    public const string UserNotFound = "User not found.";

    // Folders
    public const string FolderNotFound = "Folder not found.";
    public const string FolderNameRequired = "Folder name is required.";

    // Forms
    public const string FormNotFound = "Form not found.";
    public const string FormNameRequired = "Form name is required.";
    public const string InvalidBlockType = "One or more blocks have an invalid type.";
    public const string InvalidThemeId = "Invalid theme ID.";

    // Submissions
    public const string SubmissionNotFound = "Submission not found.";
    public const string RequiredFieldsMissing = "Required fields are missing.";

    // Generic
    public const string ValidationFailed = "Validation failed.";
    public const string InternalServerError = "Something went wrong. Please try again later.";
}

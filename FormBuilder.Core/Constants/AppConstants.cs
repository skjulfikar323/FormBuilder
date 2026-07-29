namespace FormBuilder.Core.Constants;

public static class AppConstants
{
    public static class Themes
    {
        public const string Light = "light";
        public const string Dark = "dark";
        public const string TailBlue = "tail-blue";

        public static readonly string[] All = { Light, Dark, TailBlue };
    }

    public static class BlockTypes
    {
        public const string TextBubble = "text-bubble";
        public const string ImageBubble = "image-bubble";
        public const string VideoBubble = "video-bubble";
        public const string GifBubble = "gif-bubble";
        public const string TextInput = "text-input";
        public const string NumberInput = "number-input";
        public const string EmailInput = "email-input";
        public const string PhoneInput = "phone-input";
        public const string DateInput = "date-input";
        public const string RatingInput = "rating-input";
        public const string ButtonsInput = "buttons-input";

        public static readonly string[] All =
        {
            TextBubble, ImageBubble, VideoBubble, GifBubble,
            TextInput, NumberInput, EmailInput, PhoneInput,
            DateInput, RatingInput, ButtonsInput
        };
    }

    public static class Collections
    {
        public const string Users = "users";
        public const string Folders = "folders";
        public const string Forms = "forms";
        public const string Submissions = "submissions";
    }
}

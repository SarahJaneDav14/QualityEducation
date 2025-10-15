namespace GrabABook.API.Models
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Author { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Cover { get; set; } = string.Empty;
        public bool Available { get; set; } = true;
        public string Formats { get; set; } = "digital,physical"; // JSON string
        public DateTime? DueDate { get; set; }
        public int Popularity { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    public class APBook : Book
    {
        public string Subject { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty; // "textbook" or "study-guide"
    }
}

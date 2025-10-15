namespace GrabABook.API.Models
{
    public class Donation
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty; // "money" or "book"
        public decimal Amount { get; set; } = 0; // for money donations
        public string? BookTitle { get; set; }
        public string? BookAuthor { get; set; }
        public string? BookCategory { get; set; }
        public string? BookCondition { get; set; }
        public string DonorName { get; set; } = string.Empty;
        public string DonorEmail { get; set; } = string.Empty;
        public string DonorPhone { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "pending"; // "pending", "processed", "completed"
    }

}

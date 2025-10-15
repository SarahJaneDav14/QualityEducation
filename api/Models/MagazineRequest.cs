namespace GrabABook.API.Models
{
    public class MagazineRequest
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string State { get; set; } = string.Empty;
        public string ZipCode { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string MagazineType { get; set; } = string.Empty; // "ap", "children-fantasy", "historical-nonfiction", "fiction", "education", "general"
        public DateTime RequestDate { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "pending"; // "pending", "sent", "delivered"
    }
}

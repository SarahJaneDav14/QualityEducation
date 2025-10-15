namespace GrabABook.API.Models
{
    public class Checkout
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int BookId { get; set; }
        public string DeliveryMethod { get; set; } = string.Empty; // "digital" or "physical"
        public DateTime CheckoutDate { get; set; } = DateTime.UtcNow;
        public DateTime DueDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public bool IsReturned { get; set; } = false;
        public decimal LateFee { get; set; } = 0;
        public string Status { get; set; } = "active"; // "active", "returned", "overdue"
    }

    public class CheckoutRequest
    {
        public int UserId { get; set; }
        public int BookId { get; set; }
        public string DeliveryMethod { get; set; } = string.Empty;
        public int CheckoutPeriod { get; set; } = 14; // days
        public string? Address { get; set; } // for physical delivery
    }
}

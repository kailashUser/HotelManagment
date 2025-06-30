namespace HotelReservation.Models.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public int BillingId { get; set; }
        public decimal Amount { get; set; }
        public PaymentMethod Method { get; set; }
        public PaymentStatus Status { get; set; }
        public string? TransactionId { get; set; }
        public string? CardNumber { get; set; } // Last 4 digits
        public string? CardHolderName { get; set; }
        public string? CardExpiryDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? ProcessedAt { get; set; }
    }

}

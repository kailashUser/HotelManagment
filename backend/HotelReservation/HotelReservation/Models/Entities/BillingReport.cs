namespace HotelReservation.Models.Entities
{
    public class BillingReport
    {
        public string CustomerName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }

        public string RoomNumber { get; set; }
        public int RoomType { get; set; }
        public decimal BasePrice { get; set; }

        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public int Nights { get; set; }
        public decimal DepositAmount { get; set; }

        public int ReservationStatus { get; set; } 

        public decimal RoomCharges { get; set; }
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public decimal AdditionalCharges { get; set; }
        public decimal AmountDue { get; set; }

        public decimal? AmountPaid { get; set; }
        public int? PaymentMethod { get; set; }
        public int? PaymentStatus { get; set; }
        public string TransactionId { get; set; }
        public DateTime? ProcessedAt { get; set; }
    }
}

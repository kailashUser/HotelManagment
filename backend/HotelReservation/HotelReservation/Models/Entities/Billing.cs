namespace HotelReservation.Models.Entities
{
    public class Billing
    {
        public int Id { get; set; }
        public int ReservationId { get; set; }
        public int CustomerId { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Tax { get; set; }
        public decimal Discount { get; set; }
        public decimal RoomCharges { get; set; }
        public decimal AdditionalCharges { get; set; }
        public decimal FinalAmount { get; set; }
        public BillingStatus Status { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }

}

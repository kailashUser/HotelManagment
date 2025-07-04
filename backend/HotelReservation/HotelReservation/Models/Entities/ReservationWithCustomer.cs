namespace HotelReservation.Models.Entities
{
    public class ReservationWithCustomer
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public int RoomId { get; set; }
        public DateTime CheckInDate { get; set; }
        public DateTime CheckOutDate { get; set; }
        public DateTime? ActualCheckIn { get; set; }
        public DateTime? ActualCheckOut { get; set; }
        public ReservationStatus Status { get; set; } 
        public decimal TotalAmount { get; set; }
        public decimal? DepositAmount { get; set; }
        public string? SpecialRequests { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public string? RoomName { get; set; } 
        public string? CustomerName { get; set; }
    }
}

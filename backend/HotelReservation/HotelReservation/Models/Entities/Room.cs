namespace HotelReservation.Models.Entities
{
    public class Room
    {
        public int Id { get; set; }
        public string RoomNumber { get; set; } = string.Empty;
        public RoomType Type { get; set; }
        public decimal BasePrice { get; set; }
        public int Capacity { get; set; }
        public string? Description { get; set; }
        public bool IsAvailable { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
    public enum RoomType { Standard, Deluxe, Suite, Executive, Presidential }

}

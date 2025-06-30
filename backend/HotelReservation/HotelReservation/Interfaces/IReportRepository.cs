namespace HotelReservation.Interfaces
{
    public interface IReportRepository
    {
        Task<decimal> GetTotalRevenueAsync(DateTime startDate, DateTime endDate);
        Task<IEnumerable<(string RoomType, int BookingCount)>> GetTopBookedRoomTypesAsync();
        Task<Dictionary<string, int>> GetReservationStatusSummaryAsync();
        Task<IEnumerable<(string CustomerName, decimal TotalSpent)>> GetCustomerSpendingSummaryAsync();
        Task<decimal> GetOccupancyRateAsync(DateTime startDate, DateTime endDate);
    }
}

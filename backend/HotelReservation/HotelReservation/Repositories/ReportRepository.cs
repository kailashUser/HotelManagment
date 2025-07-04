using Dapper;
using HotelReservation.Data;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;

namespace HotelReservation.Repositories
{
    public class ReportRepository : IReportRepository
    {
        private readonly DapperContext _context;

        public ReportRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<decimal> GetTotalRevenueAsync(DateTime start, DateTime end)
        {
            var sql = @"SELECT ISNULL(SUM(FinalAmount), 0) FROM Billings
                        WHERE CreatedAt BETWEEN @start AND @end AND Status = 1";
            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<decimal>(sql, new { start, end });
        }

        public async Task<IEnumerable<(string RoomType, int BookingCount)>> GetTopBookedRoomTypesAsync()
        {
            var sql = @"SELECT R.Type AS RoomType, COUNT(*) AS BookingCount
                        FROM Reservations Res
                        INNER JOIN Rooms R ON Res.RoomId = R.Id
                        GROUP BY R.Type
                        ORDER BY BookingCount DESC";
            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<(string, int)>(sql);
        }

        public async Task<Dictionary<string, int>> GetReservationStatusSummaryAsync()
        {
            var sql = @"SELECT Status, COUNT(*) AS Count FROM Reservations GROUP BY Status";
            using var conn = _context.CreateConnection();
            var results = await conn.QueryAsync<(int Status, int Count)>(sql);
            return results.ToDictionary(r => ((Models.Entities.ReservationStatus)r.Status).ToString(), r => r.Count);
        }

        public async Task<IEnumerable<(string CustomerName, decimal TotalSpent)>> GetCustomerSpendingSummaryAsync()
        {
            var sql = @"SELECT C.FirstName + ' ' + C.LastName AS CustomerName, SUM(B.FinalAmount) AS TotalSpent
                        FROM Billings B
                        INNER JOIN Customers C ON B.CustomerId = C.Id
                        WHERE B.Status = 1
                        GROUP BY C.FirstName, C.LastName
                        ORDER BY TotalSpent DESC";
            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<(string, decimal)>(sql);
        }

        public async Task<decimal> GetOccupancyRateAsync(DateTime start, DateTime end)
        {
            var sql = @"SELECT CAST(COUNT(*) AS decimal) / NULLIF((SELECT COUNT(*) FROM Rooms), 0)
                        FROM Reservations
                        WHERE CheckInDate <= @end AND CheckOutDate >= @start AND Status IN (1, 2)";
            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<decimal>(sql, new { start, end });
        }

        public async Task<IEnumerable<BillingReport>> GetBillingReportAsync()
        {
            var sql = @"
    SELECT
        C.FirstName + ' ' + C.LastName AS CustomerName,
        C.Email,
        C.PhoneNumber,
        Rm.RoomNumber,
        Rm.Type AS RoomType,
        Rm.BasePrice,
        Res.CheckInDate,
        Res.CheckOutDate,
        DATEDIFF(DAY, Res.CheckInDate, Res.CheckOutDate) AS Nights,
        Res.DepositAmount,
        Res.Status AS ReservationStatus, -- ✅ Added this line
        B.RoomCharges,
        B.Tax,
        B.Discount,
        B.AdditionalCharges,
        B.FinalAmount AS AmountDue,
        P.Amount AS AmountPaid,
        P.Method AS PaymentMethod,
        P.Status AS PaymentStatus,
        P.TransactionId,
        P.ProcessedAt
    FROM Billings B
    JOIN Reservations Res ON B.ReservationId = Res.Id
    JOIN Customers C ON Res.CustomerId = C.Id
    JOIN Rooms Rm ON Res.RoomId = Rm.Id
    LEFT JOIN Payments P ON P.BillingId = B.Id";

            using var connection = _context.CreateConnection();
            var result = await connection.QueryAsync<BillingReport>(sql);
            return result;
        }
    }
}

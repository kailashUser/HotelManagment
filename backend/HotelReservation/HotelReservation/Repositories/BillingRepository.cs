using Dapper;
using HotelReservation.Data;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;

namespace HotelReservation.Repositories
{
    public class BillingRepository : IBillingRepository
    {
        private readonly DapperContext _context;

        public BillingRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Billing>> GetAllAsync()
        {
            var sql = "SELECT * FROM Billings";
            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<Billing>(sql);
        }

        public async Task<Billing?> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Billings WHERE Id = @Id";
            using var conn = _context.CreateConnection();
            return await conn.QueryFirstOrDefaultAsync<Billing>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Billing billing)
        {
            var sql = @"INSERT INTO Billings 
                (ReservationId, TotalAmount, Tax, Discount, RoomCharges, AdditionalCharges, FinalAmount, Status, CreatedAt)
                VALUES 
                (@ReservationId, @TotalAmount, @Tax, @Discount, @RoomCharges, @AdditionalCharges, @FinalAmount, @Status, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() as int);";

            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, billing);
        }

        public async Task<bool> UpdateAsync(Billing billing)
        {
            var sql = @"UPDATE Billings SET 
                ReservationId = @ReservationId,
                CustomerId = @CustomerId,
                TotalAmount = @TotalAmount,
                Tax = @Tax,
                Discount = @Discount,
                RoomCharges = @RoomCharges,
                AdditionalCharges = @AdditionalCharges,
                FinalAmount = @FinalAmount,
                Status = @Status,
                UpdatedAt = @UpdatedAt
                WHERE Id = @Id";

            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, billing);
            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Billings WHERE Id = @Id";
            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }


        public async Task<bool> HandleNoShowReservationsAsync()
        {
            var currentDate = DateTime.Today;
            var cutoffTime = currentDate.AddHours(19); // 7 PM

            const string getNoShowReservationsSql = @"
        SELECT * FROM Reservations
        WHERE CheckInDate = @Today
        AND Status = 'Reserved'
        AND GETDATE() > @CutoffTime";

            const string updateReservationStatusSql = @"
        UPDATE Reservations
        SET Status = 'Cancelled - No Show'
        WHERE Id = @ReservationId";

            const string insertBillingSql = @"
        INSERT INTO Billings 
        (ReservationId, TotalAmount, Tax, Discount, RoomCharges, AdditionalCharges, FinalAmount, Status, CreatedAt)
        VALUES 
        (@ReservationId, @TotalAmount, @Tax, @Discount, @RoomCharges, @AdditionalCharges, @FinalAmount, @Status, @CreatedAt);";

            try
            {
                using var conn = _context.CreateConnection();
                var reservations = await conn.QueryAsync<Reservation>(
                    getNoShowReservationsSql,
                    new { Today = currentDate, CutoffTime = cutoffTime });

                foreach (var res in reservations)
                {
                    // 1. Update reservation status
                    await conn.ExecuteAsync(updateReservationStatusSql, new { ReservationId = res.Id });

                    // 2. Calculate no-show billing
                    decimal noShowCharge = 100; // example value
                    decimal tax = noShowCharge * 0.1m; // 10% tax
                    decimal finalAmount = noShowCharge + tax;

                    var billing = new
                    {
                        ReservationId = res.Id,
                        TotalAmount = noShowCharge,
                        Tax = tax,
                        Discount = 0m,
                        RoomCharges = 0m,
                        AdditionalCharges = 0m,
                        FinalAmount = finalAmount,
                        Status = "Unpaid",
                        CreatedAt = DateTime.Now
                    };

                    await conn.ExecuteAsync(insertBillingSql, billing);
                }

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in HandleNoShowReservationsAsync: {ex.Message}");
                return false;
            }
        }

    }
}

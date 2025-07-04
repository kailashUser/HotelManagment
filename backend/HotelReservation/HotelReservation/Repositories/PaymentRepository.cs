using Dapper;
using HotelReservation.Data;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;

namespace HotelReservation.Repositories
{
    public class PaymentRepository : IPaymentRepository
    {
        private readonly DapperContext _context;

        public PaymentRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Payment>> GetAllAsync()
        {
            var sql = "SELECT * FROM Payments";
            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<Payment>(sql);
        }

        public async Task<Payment?> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Payments WHERE Id = @Id";
            using var conn = _context.CreateConnection();
            return await conn.QueryFirstOrDefaultAsync<Payment>(sql, new { Id = id });
        }

        //public async Task<int> CreateAsync(Payment payment)
        //{
        //    var sql = @"INSERT INTO Payments 
        //        (BillingId, Amount, Method, Status, TransactionId, CardNumber, CardHolderName, CardExpiryDate, CreatedAt, ProcessedAt)
        //        VALUES 
        //        (@BillingId, @Amount, @Method, @Status, @TransactionId, @CardNumber, @CardHolderName, @CardExpiryDate, @CreatedAt, @ProcessedAt);
        //        SELECT CAST(SCOPE_IDENTITY() as int);";

        //    using var conn = _context.CreateConnection();
        //    return await conn.ExecuteScalarAsync<int>(sql, payment);
        //}


        public async Task<int> CreateAsync(Payment payment)
        {
            var sql = @"
                DECLARE @intReservationID INT;

                INSERT INTO Payments 
                    (BillingId, Amount, Method, Status, TransactionId, CardNumber, CardHolderName, CardExpiryDate, CreatedAt, ProcessedAt)
                VALUES 
                    (@BillingId, @Amount, @Method, @Status, @TransactionId, @CardNumber, @CardHolderName, @CardExpiryDate, @CreatedAt, @ProcessedAt);

                SET @intReservationID = (SELECT ReservationId FROM Billings WHERE Id = @BillingId);

                UPDATE Reservations SET Status = 1 WHERE Id = @intReservationID;

                SELECT CAST(SCOPE_IDENTITY() AS INT);
            ";

            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, payment);
        }



        public async Task<bool> UpdateAsync(Payment payment)
        {
            var sql = @"UPDATE Payments SET 
                BillingId = @BillingId,
                Amount = @Amount,
                Method = @Method,
                Status = @Status,
                TransactionId = @TransactionId,
                CardNumber = @CardNumber,
                CardHolderName = @CardHolderName,
                CardExpiryDate = @CardExpiryDate,
                UpdatedAt = @UpdatedAt,
                ProcessedAt = @ProcessedAt
                WHERE Id = @Id";

            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, payment);
            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Payments WHERE Id = @Id";
            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }

        public async Task<bool> NoShowBilling(int ReservationID)
        {
            using var connection = _context.CreateConnection();

            // Get target billing based on reservation ID
            var billing = await connection.QuerySingleOrDefaultAsync<Billing>(
                "SELECT * FROM Billings WHERE ReservationId = @ReservationId",
                new { ReservationId = ReservationID });

            if (billing == null)
                return false;

            // Get payment from the original billing
            var paymentToCopy = await connection.QuerySingleOrDefaultAsync<Payment>(
                "SELECT * FROM Payments WHERE BillingId = @SourceBillingId",
                new { SourceBillingId = billing.Id }); // ⚠️ fixed: must use billing.Id, not reservationId

            if (paymentToCopy == null)
                return false;

            // Insert new payment
            var insertSql = @"
        INSERT INTO Payments 
        (BillingId, Amount, Method, Status, TransactionId, CardNumber, CardHolderName, CardExpiryDate, CreatedAt, UpdatedAt, ProcessedAt)
        VALUES 
        (@BillingId, @Amount, @Method, @Status, @TransactionId, @CardNumber, @CardHolderName, @CardExpiryDate, @CreatedAt, @UpdatedAt, @ProcessedAt);
    ";

            var rows = await connection.ExecuteAsync(insertSql, new
            {
                BillingId = billing.Id,
                Amount = paymentToCopy.Amount,
                Method = paymentToCopy.Method,
                Status = paymentToCopy.Status,
                TransactionId = paymentToCopy.TransactionId,
                CardNumber = paymentToCopy.CardNumber,
                CardHolderName = paymentToCopy.CardHolderName,
                CardExpiryDate = paymentToCopy.CardExpiryDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                ProcessedAt = DateTime.UtcNow
            });

            if (rows == 0)
                return false;

            // ✅ Update reservation status to Cancelled (4)
            var updateSql = @"UPDATE Reservations SET Status = 4 WHERE Id = @ReservationId";

            await connection.ExecuteAsync(updateSql, new { ReservationId = ReservationID });

            return true;
        }


    }
}

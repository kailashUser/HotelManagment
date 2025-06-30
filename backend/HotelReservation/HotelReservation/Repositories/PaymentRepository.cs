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

        public async Task<int> CreateAsync(Payment payment)
        {
            var sql = @"INSERT INTO Payments 
                (BillingId, Amount, Method, Status, TransactionId, CardNumber, CardHolderName, CardExpiryDate, CreatedAt, ProcessedAt)
                VALUES 
                (@BillingId, @Amount, @Method, @Status, @TransactionId, @CardNumber, @CardHolderName, @CardExpiryDate, @CreatedAt, @ProcessedAt);
                SELECT CAST(SCOPE_IDENTITY() as int);";

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
    }
}

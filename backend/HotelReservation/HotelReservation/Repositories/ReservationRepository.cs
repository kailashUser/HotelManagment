using Dapper;
using HotelReservation.Data;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;

namespace HotelReservation.Repositories
{
    public class ReservationRepository : IReservationRepository
    {
        private readonly DapperContext _context;

        public ReservationRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Reservation>> GetAllAsync()
        {
            var sql = "SELECT * FROM Reservations";
            using var connection = _context.CreateConnection();
            var res = await connection.QueryAsync<Reservation>(sql);
            return res;
        }

        public async Task<Reservation?> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Reservations WHERE Id = @Id";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<Reservation>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Reservation reservation)
        {
            var sql = @"
                INSERT INTO Reservations 
                (CustomerId, RoomId, CheckInDate, CheckOutDate, ActualCheckIn, ActualCheckOut, 
                 Status, TotalAmount, DepositAmount, SpecialRequests, CreatedAt)
                VALUES 
                (@CustomerId, @RoomId, @CheckInDate, @CheckOutDate, @ActualCheckIn, @ActualCheckOut,
                 @Status, @TotalAmount, @DepositAmount, @SpecialRequests, @CreatedAt);
                SELECT CAST(SCOPE_IDENTITY() AS INT);";

            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync<int>(sql, reservation);
        }

        public async Task<bool> UpdateAsync(Reservation reservation)
        {
            var sql = @"
                UPDATE Reservations SET 
                    CustomerId = @CustomerId,
                    RoomId = @RoomId,
                    CheckInDate = @CheckInDate,
                    CheckOutDate = @CheckOutDate,
                    ActualCheckIn = @ActualCheckIn,
                    ActualCheckOut = @ActualCheckOut,
                    Status = @Status,
                    TotalAmount = @TotalAmount,
                    DepositAmount = @DepositAmount,
                    SpecialRequests = @SpecialRequests,
                    UpdatedAt = @UpdatedAt
                WHERE Id = @Id";

            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync(sql, reservation);
            return rows > 0;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Reservations WHERE Id = @Id";
            using var connection = _context.CreateConnection();
            var rows = await connection.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }
    }

}

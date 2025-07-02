using Dapper;
using HotelReservation.Data;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;

namespace HotelReservation.Repositories
{
    public class RoomRepository : IRoomRepository
    {
        private readonly DapperContext _context;
        public RoomRepository(DapperContext context) => _context = context;

        public async Task<IEnumerable<Room>> GetAllAsync()
        {
            var sql = "SELECT * FROM Rooms";
            using var conn = _context.CreateConnection();
            return await conn.QueryAsync<Room>(sql);
        }

        public async Task<Room?> GetByIdAsync(int id)
        {
            var sql = "SELECT * FROM Rooms WHERE Id = @Id";
            using var conn = _context.CreateConnection();
            return await conn.QueryFirstOrDefaultAsync<Room>(sql, new { Id = id });
        }

        public async Task<int> CreateAsync(Room room)
        {
            var sql = @"INSERT INTO Rooms (RoomNumber, Type, BasePrice, Capacity, Description, IsAvailable, CreatedAt)
                         VALUES (@RoomNumber, @Type, @BasePrice, @Capacity, @Description, @IsAvailable, @CreatedAt);
                         SELECT CAST(SCOPE_IDENTITY() as int);";
            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, room);
        }

      

        public async Task<bool> DeleteAsync(int id)
        {
            var sql = "DELETE FROM Rooms WHERE Id = @Id";
            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, new { Id = id });
            return rows > 0;
        }

        public async Task<bool> UpdateAsync(int id, Room room)
        {
            var sql = @"UPDATE Rooms SET RoomNumber = @RoomNumber, Type = @Type, BasePrice = @BasePrice,
                         Capacity = @Capacity, Description = @Description, IsAvailable = @IsAvailable, UpdatedAt = @UpdatedAt
                         WHERE Id = @Id";
            using var conn = _context.CreateConnection();
            var rows = await conn.ExecuteAsync(sql, new
            {
                Id = id,
                RoomNumber = room.RoomNumber,
                Type = room.Type,
                BasePrice = room.BasePrice,
                Capacity = room.Capacity,
                Description = room.Description,
                IsAvailable = room.IsAvailable,
                UpdatedAt = room.UpdatedAt
            });
            return rows > 0;
        }
    }
}

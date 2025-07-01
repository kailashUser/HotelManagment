using Dapper;
using HotelReservation.Data;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;

namespace HotelReservation.Repositories
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DapperContext _context;
        public AuthRepository(DapperContext context)
        {
            _context = context;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var sql = "DELETE FROM Users WHERE Id = @Id";
            using var conn = _context.CreateConnection();
            var rowsAffected = await conn.ExecuteAsync(sql, new { Id = id });
            return rowsAffected > 0;
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            var sql = "SELECT * FROM Users";
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<User>(sql);
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var sql = "SELECT * FROM Users WHERE Email = @Email";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
        }

        public async Task<User> GetUserByIdAsync(int id)
        {
            var sql = "SELECT * FROM Users WHERE Id = @Id";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Id = id });
        }

        public async Task<int> RegisterAsync(User user)
        {
            //var sql = @"INSERT INTO Users (Username, Email, PasswordHash, Role, CustomerId, FirstName, LastName, PhoneNumber, IsActive, CreatedAt)
            //            VALUES (@Username, @Email, @PasswordHash, @Role, @CustomerId, @FirstName, @LastName, @PhoneNumber, @IsActive, @CreatedAt);
            //            SELECT CAST(SCOPE_IDENTITY() as int);";
            //using var conn = _context.CreateConnection();
            //return await conn.ExecuteScalarAsync<int>(sql, user);

            var sql = @"INSERT INTO Users (Username, Email, PasswordHash, RoleID, FirstName, LastName, PhoneNumber, IsActive, CreatedAt)
                        VALUES (@Username, @Email, @PasswordHash, @RoleId , @FirstName, @LastName, @PhoneNumber, @IsActive, @CreatedAt);
                        SELECT CAST(SCOPE_IDENTITY() as int);";
            using var conn = _context.CreateConnection();
            return await conn.ExecuteScalarAsync<int>(sql, user);
        }

        public async Task<bool> UpdateUserAsync(User user)
        {
            var sql = @"UPDATE Users 
                    SET Username = @Username,
                        Email = @Email,
                        FirstName = @FirstName,
                        LastName = @LastName,
                        PhoneNumber = @PhoneNumber,
                        IsActive = @IsActive,
                        RoleId = @RoleId
                    WHERE Id = @Id";

            using var conn = _context.CreateConnection();
            var rowsAffected = await conn.ExecuteAsync(sql, user);
            return rowsAffected > 0;
        }
    }
}

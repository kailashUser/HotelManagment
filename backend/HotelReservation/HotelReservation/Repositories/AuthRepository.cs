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

        public async Task<User> GetUserByEmailAsync(string email)
        {
            var sql = "SELECT * FROM Users WHERE Email = @Email";
            using var connection = _context.CreateConnection();
            return await connection.QueryFirstOrDefaultAsync<User>(sql, new { Email = email });
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
    }
}

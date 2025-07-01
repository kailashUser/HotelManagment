using HotelReservation.Models.Entities;

namespace HotelReservation.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> GetUserByEmailAsync(string email);
        Task<User> GetUserByIdAsync(int id);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<int> RegisterAsync(User user);
        Task<bool> UpdateUserAsync(User user);
    }
}

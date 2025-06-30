using HotelReservation.Models.Entities;

namespace HotelReservation.Interfaces
{
    public interface IAuthRepository
    {
        Task<User> GetUserByEmailAsync(string email);
        Task<int> RegisterAsync(User user);
    }
}

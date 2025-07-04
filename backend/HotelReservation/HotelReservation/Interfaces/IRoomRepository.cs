using HotelReservation.Models.Entities;

namespace HotelReservation.Interfaces
{
    public interface IRoomRepository
    {
        Task<IEnumerable<Room>> GetAllAsync();
        Task<Room?> GetByIdAsync(int id);
        Task<int> CreateAsync(Room room);
        Task<bool> UpdateAsync(int id, Room room);
        Task<bool> DeleteAsync(int id);
    }
}

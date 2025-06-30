using HotelReservation.Models.Entities;

namespace HotelReservation.Interfaces
{
    public interface IBillingRepository
    {
        Task<IEnumerable<Billing>> GetAllAsync();
        Task<Billing?> GetByIdAsync(int id);
        Task<int> CreateAsync(Billing billing);
        Task<bool> UpdateAsync(Billing billing);
        Task<bool> DeleteAsync(int id);
        Task<bool> HandleNoShowReservationsAsync();

    }
}

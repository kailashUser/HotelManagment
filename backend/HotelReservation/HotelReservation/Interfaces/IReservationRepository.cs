using HotelReservation.Models.Entities;

namespace HotelReservation.Interfaces
{
    public interface IReservationRepository
    {
        Task<IEnumerable<Reservation>> GetAllAsync();
        Task<Reservation?> GetByIdAsync(int id);
        Task<int> CreateAsync(Reservation reservation);
        Task<bool> UpdateAsync(Reservation reservation);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<ReservationWithCustomer>> GetAllWithCustomerAsync();
        Task<ReservationWithCustomer?> GetByIdWithCustomerAsync(int id);
        Task<IEnumerable<Reservation>> GetByCustomerIdAsync(int customerId);
    }
}

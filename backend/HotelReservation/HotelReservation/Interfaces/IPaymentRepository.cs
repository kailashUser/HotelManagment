using HotelReservation.Models.Entities;

namespace HotelReservation.Interfaces
{
    public interface IPaymentRepository
    {
        Task<IEnumerable<Payment>> GetAllAsync();
        Task<Payment?> GetByIdAsync(int id);
        Task<int> CreateAsync(Payment payment);
        Task<bool> UpdateAsync(Payment payment);
        Task<bool> DeleteAsync(int id);
    }
}

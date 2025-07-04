using HotelReservation.Helpers;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentRepository _repo;

        public PaymentController(IPaymentRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repo.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<Payment>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _repo.GetByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<string>.Fail("Payment not found"));
            return Ok(ApiResponse<Payment>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create(Payment payment)
        {
            payment.CreatedAt = DateTime.UtcNow;
            payment.ProcessedAt ??= DateTime.UtcNow;
            var id = await _repo.CreateAsync(payment);
            return Ok(ApiResponse<int>.Ok(id, "Payment created"));
           
        }

        [HttpPut]
        public async Task<IActionResult> Update(Payment payment)
        {
            payment.UpdatedAt = DateTime.UtcNow;
            var updated = await _repo.UpdateAsync(payment);
            if (!updated)
                return NotFound(ApiResponse<string>.Fail("Payment not found"));
            return Ok(ApiResponse<string>.Ok("Payment updated"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<string>.Fail("Payment not found"));
            return Ok(ApiResponse<string>.Ok("Payment deleted"));
        }


        [HttpPost("NoShowBilling")]
        public async Task<IActionResult> DuplicatePayment(int reservationID)
        {
            var success = await _repo.NoShowBilling(reservationID);

            return success
                ? Ok(ApiResponse<string>.Ok("Payment duplicated successfully"))
                : BadRequest(ApiResponse<string>.Fail("Failed to duplicate payment"));
        }

    }
}

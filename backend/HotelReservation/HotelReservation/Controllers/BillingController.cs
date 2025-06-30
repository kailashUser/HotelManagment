using HotelReservation.Helpers;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;
using HotelReservation.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace HotelReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BillingController : ControllerBase
    {
        private readonly IBillingRepository _repo;

        public BillingController(IBillingRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repo.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<Billing>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _repo.GetByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<string>.Fail("Billing record not found"));
            return Ok(ApiResponse<Billing>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create(Billing billing)
        {
            billing.CreatedAt = DateTime.UtcNow;
            var id = await _repo.CreateAsync(billing);
            return Ok(ApiResponse<int>.Ok(id, "Billing created"));
        }

        [HttpPut]
        public async Task<IActionResult> Update(Billing billing)
        {
            billing.UpdatedAt = DateTime.UtcNow;
            var updated = await _repo.UpdateAsync(billing);
            if (!updated)
                return NotFound(ApiResponse<string>.Fail("Billing not found"));
            return Ok(ApiResponse<string>.Ok("Billing updated"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted)
                return NotFound(ApiResponse<string>.Fail("Billing not found"));
            return Ok(ApiResponse<string>.Ok("Billing deleted"));
        }

        [HttpPost("handle-no-show")]
        public async Task<IActionResult> HandleNoShowReservations()
        {
            var result = await _repo.HandleNoShowReservationsAsync();
            if (result)
                return Ok(new { message = "No-show reservations processed successfully." });

            return StatusCode(500, new { message = "Failed to process no-show reservations." });
        }
    }
}

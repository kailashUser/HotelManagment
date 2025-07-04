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
    public class ReservationController : ControllerBase
    {
        private readonly IReservationRepository _repo;

        public ReservationController(IReservationRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("with-customer")]
        public async Task<IActionResult> GetAllWithCustomer()
        {
            var result = await _repo.GetAllWithCustomerAsync();
            return Ok(ApiResponse<IEnumerable<ReservationWithCustomer>>.Ok(result));
        }

       
        [HttpGet("with-customer/{customerId}")]
        public async Task<IActionResult> GetByIdWithCustomer(int customerId)
        {
            var result = await _repo.GetByIdWithCustomerAsync(customerId);
            if (result == null)
                return NotFound(ApiResponse<string>.Fail("Reservation not found"));

            
            return Ok(ApiResponse<IEnumerable<ReservationWithCustomer>>.Ok(result));
        }




        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repo.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<Reservation>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _repo.GetByIdAsync(id);
            if (result == null)
                return NotFound(ApiResponse<string>.Fail("Reservation not found"));

            return Ok(ApiResponse<Reservation>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] Reservation reservation)
        {
            if (reservation.CheckOutDate <= reservation.CheckInDate)
                return BadRequest(ApiResponse<string>.Fail("Check-out date must be after check-in date"));

            reservation.CreatedAt = DateTime.UtcNow;
            var id = await _repo.CreateAsync(reservation);
            return Ok(ApiResponse<int>.Ok(id, "Reservation created successfully"));
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] Reservation reservation)
        {
            if (reservation.CheckOutDate <= reservation.CheckInDate)
                return BadRequest(ApiResponse<string>.Fail("Check-out date must be after check-in date"));

            reservation.UpdatedAt = DateTime.UtcNow;
            var success = await _repo.UpdateAsync(reservation);
            if (!success)
                return NotFound(ApiResponse<string>.Fail("Reservation not found"));

            return Ok(ApiResponse<string>.Ok("Reservation updated successfully"));
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _repo.DeleteAsync(id);
            if (!success)
                return NotFound(ApiResponse<string>.Fail("Reservation not found"));

            return Ok(ApiResponse<string>.Ok("Reservation deleted successfully"));
        }

        [HttpPatch("{id}/cancel")]
        public async Task<IActionResult> Cancel(int id)
        {
            var reservation = await _repo.GetByIdAsync(id);
            if (reservation == null)
                return NotFound(ApiResponse<string>.Fail("Reservation not found"));

            reservation.Status = ReservationStatus.Cancelled;
            reservation.UpdatedAt = DateTime.UtcNow;
            var success = await _repo.UpdateAsync(reservation);

            return success
                ? Ok(ApiResponse<string>.Ok("Reservation cancelled successfully"))
                : BadRequest(ApiResponse<string>.Fail("Cancellation failed"));
        }

        [HttpGet("by-customer/{customerId}")]
        public async Task<IActionResult> GetByCustomerId(int customerId)
        {
            var result = await _repo.GetByCustomerIdAsync(customerId);
            return Ok(ApiResponse<IEnumerable<Reservation>>.Ok(result));
        }

        [HttpPut("updateStatus")]
        public async Task<IActionResult> updateStatus([FromBody] Reservation reservation)
        {
            if (reservation.CheckOutDate <= reservation.CheckInDate)
                return BadRequest(ApiResponse<string>.Fail("Check-out date must be after check-in date"));

            reservation.UpdatedAt = DateTime.UtcNow;
            var success = await _repo.updateStatus(reservation);
            if (!success)
                return NotFound(ApiResponse<string>.Fail("Reservation not found"));

            return Ok(ApiResponse<string>.Ok("Reservation updated successfully"));
        }

        [HttpPut("updateReservation")]
        public async Task<IActionResult> UpdateReservation([FromBody] Reservation reservation)
        {
           

            var updated = await _repo.UpdateReservationByIdAsync(reservation);

            if (!updated)
                return NotFound(ApiResponse<string>.Fail("Reservation not found"));

            return Ok(ApiResponse<string>.Ok("Reservation updated successfully"));
        }


        [HttpPut("ReservationUpdate")]
        public async Task<IActionResult> updateStatusCheckout([FromBody] Reservation reservation)
        {
            if (reservation.CheckOutDate <= reservation.CheckInDate)
                return BadRequest(ApiResponse<string>.Fail("Check-out date must be after check-in date"));

            reservation.UpdatedAt = DateTime.UtcNow;
            var success = await _repo.updateStatus(reservation);
            if (!success)
                return NotFound(ApiResponse<string>.Fail("Reservation not found"));

            return Ok(ApiResponse<string>.Ok("Reservation updated successfully"));
        }


        [HttpPatch("autocancel")]
        public async Task<IActionResult> autocancel()
        {
            var success = await _repo.reservationautocancel();

            return success
                ? Ok(ApiResponse<string>.Ok("Reservation cancelled successfully"))
                : BadRequest(ApiResponse<string>.Fail("Cancellation failed"));
        }


    }
}

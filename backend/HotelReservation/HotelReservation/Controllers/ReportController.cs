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
    //[Authorize(Roles = "Admin,Manager")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly IReportRepository _repo;

        public ReportController(IReportRepository repo)
        {
            _repo = repo;
        }

        [HttpGet("total-revenue")]
        public async Task<IActionResult> GetTotalRevenue([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var result = await _repo.GetTotalRevenueAsync(from, to);
            return Ok(ApiResponse<decimal>.Ok(result));
        }

        [HttpGet("top-booked-rooms")]
        public async Task<IActionResult> GetTopBookedRoomTypes()
        {
            var result = await _repo.GetTopBookedRoomTypesAsync();
            return Ok(ApiResponse<object>.Ok(result));
        }

        [HttpGet("reservation-status-summary")]
        public async Task<IActionResult> GetReservationStatusSummary()
        {
            var result = await _repo.GetReservationStatusSummaryAsync();
            return Ok(ApiResponse<object>.Ok(result));
        }

        [HttpGet("customer-spending")]
        public async Task<IActionResult> GetCustomerSpendingSummary()
        {
            var result = await _repo.GetCustomerSpendingSummaryAsync();
            return Ok(ApiResponse<object>.Ok(result));
        }

        [HttpGet("occupancy-rate")]
        public async Task<IActionResult> GetOccupancyRate([FromQuery] DateTime from, [FromQuery] DateTime to)
        {
            var result = await _repo.GetOccupancyRateAsync(from, to);
            return Ok(ApiResponse<decimal>.Ok(result));
        }

        [HttpGet("billing-report")]
        public async Task<IActionResult> GetBillingReport()
        {
            var result = await _repo.GetBillingReportAsync();
            return Ok(ApiResponse<IEnumerable<BillingReport>>.Ok(result));
        }
    }
}

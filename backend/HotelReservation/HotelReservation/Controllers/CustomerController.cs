using HotelReservation.Helpers;
using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace HotelReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerRepository _repo;

        public CustomerController(ICustomerRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repo.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<Customer>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _repo.GetByIdAsync(id);
            if (result == null) return NotFound(ApiResponse<string>.Fail("Customer not found"));
            return Ok(ApiResponse<Customer>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create(Customer customer)
        {
            customer.CreatedAt = DateTime.UtcNow;
            var id = await _repo.CreateAsync(customer);
            return Ok(ApiResponse<int>.Ok(id, "Customer created"));
        }

        [HttpPut]
        public async Task<IActionResult> Update(Customer customer)
        {
            customer.UpdatedAt = DateTime.UtcNow;
            var updated = await _repo.UpdateAsync(customer);
            if (!updated) return NotFound(ApiResponse<string>.Fail("Customer not found"));
            return Ok(ApiResponse<string>.Ok("Customer updated"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted) return NotFound(ApiResponse<string>.Fail("Customer not found"));
            return Ok(ApiResponse<string>.Ok("Customer deleted"));
        }
    }
}

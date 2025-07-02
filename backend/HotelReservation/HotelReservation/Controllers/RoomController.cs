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
    public class RoomController : ControllerBase
    {
        private readonly IRoomRepository _repo;

        public RoomController(IRoomRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _repo.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<Room>>.Ok(result));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var result = await _repo.GetByIdAsync(id);
            if (result == null) return NotFound(ApiResponse<string>.Fail("Room not found"));
            return Ok(ApiResponse<Room>.Ok(result));
        }

        [HttpPost]
        public async Task<IActionResult> Create(Room room)
        {
            room.CreatedAt = DateTime.UtcNow;
            var id = await _repo.CreateAsync(room);
            return Ok(ApiResponse<int>.Ok(id, "Room created"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Room room)
        {
            if (room == null)
            {
                return BadRequest(ApiResponse<string>.Fail("Room data is required"));
            }

            room.UpdatedAt = DateTime.UtcNow;

            var updated = await _repo.UpdateAsync(id, room);
            if (!updated) return NotFound(ApiResponse<string>.Fail("Room not found"));
            return Ok(ApiResponse<string>.Ok("Room updated"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var deleted = await _repo.DeleteAsync(id);
            if (!deleted) return NotFound(ApiResponse<string>.Fail("Room not found"));
            return Ok(ApiResponse<string>.Ok("Room deleted"));
        }
    }
}

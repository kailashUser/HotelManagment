using HotelReservation.Interfaces;
using HotelReservation.Models.Entities;
using HotelReservation.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

using System.Text;
using System.Security.Cryptography;
using HotelReservation.Helpers;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;

namespace HotelReservation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController : ControllerBase
    {
        private readonly IAuthRepository _repo;
        private readonly TokenService _tokenService;

        public AuthController(IAuthRepository repo, TokenService tokenService)
        {
            _repo = repo;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(User user)
        {
            var existingUser = await _repo.GetUserByEmailAsync(user.Email);
            if (existingUser != null)
                return BadRequest(ApiResponse<string>.Fail("Email already registered"));

            user.PasswordHash = HashPassword(user.PasswordHash);
            var id = await _repo.RegisterAsync(user);
            return Ok(ApiResponse<int>.Ok(id, "User registered successfully"));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto login)
        {
            var user = await _repo.GetUserByEmailAsync(login.Email);
            if (user == null || !VerifyPassword(login.Password, user.PasswordHash))
                return Unauthorized(ApiResponse<string>.Fail("Invalid credentials"));

            var token = _tokenService.CreateToken(user);
            return Ok(ApiResponse<string>.Ok(token, "Login successful"));
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _repo.GetUserByIdAsync(id);
            if (user == null)
                return NotFound(ApiResponse<string>.Fail("User not found"));
            return Ok(ApiResponse<User>.Ok(user, "User fetched successfully"));
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _repo.GetAllUsersAsync();
            return Ok(ApiResponse<IEnumerable<User>>.Ok(users, "Users fetched successfully"));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] User updatedUser)
        {
            var existing = await _repo.GetUserByIdAsync(id);
            if (existing == null)
                return NotFound(ApiResponse<string>.Fail("User not found"));

            updatedUser.Id = id;
            var updated = await _repo.UpdateUserAsync(updatedUser);
            if (!updated)
                return BadRequest(ApiResponse<string>.Fail("Update failed"));

            return Ok(ApiResponse<string>.Ok(null, "User updated successfully"));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var existing = await _repo.GetUserByIdAsync(id);
            if (existing == null)
                return NotFound(ApiResponse<string>.Fail("User not found"));

            var deleted = await _repo.DeleteUserAsync(id);
            if (!deleted)
                return BadRequest(ApiResponse<string>.Fail("Delete failed"));

            return Ok(ApiResponse<string>.Ok(null, "User deleted successfully"));
        }

        private string HashPassword(string password)
        {
            using var sha = SHA256.Create();
            var bytes = Encoding.UTF8.GetBytes(password);
            var hash = sha.ComputeHash(bytes);
            return Convert.ToBase64String(hash);
        }

        private bool VerifyPassword(string password, string storedHash)
        {
            var hash = HashPassword(password);
            return hash == storedHash;
        }

        public class LoginRequestDto
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

    }
}

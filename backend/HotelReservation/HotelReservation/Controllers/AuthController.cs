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

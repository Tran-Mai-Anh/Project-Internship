using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Models.Entities;
using VehicleManagementSystem.Services.Interfaces;

namespace VehicleManagementSystem.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly PostSQLDbContext _context;
        private readonly IAuthService _authService;
        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request) => await _authService.Login(request);

        [HttpPost("register")]
        public async Task<IActionResult> RegisterWithVehicle(RegisterRequest request) => await _authService.RegisterWithVehicle(request);
    }

}


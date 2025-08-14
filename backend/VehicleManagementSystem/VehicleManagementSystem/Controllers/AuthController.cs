using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Services.Interfaces;

namespace VehicleManagementSystem.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            return await _authService.Login(request);
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterWithVehicle([FromBody] RegisterRequest request)
        {
            return await _authService.RegisterUserAndVehicleAsync(request);
        }
    }
}

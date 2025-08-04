using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using VehicleManagementSystem.Services.Interfaces;
namespace VehicleManagementSystem.Controllers
{
    [ApiController]
    [Route("api/vehicles")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _service;

        public VehiclesController(IVehicleService service) => _service = service;

        [Authorize]
        [HttpGet("all-vehicles")]
        public async Task<IActionResult> GetMyVehicles()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized(new { message = "User ID not found in token." });

            int userId = int.Parse(userIdClaim.Value);
            var vehicles = await _service.GetVehiclesByUserId(userId);
            return vehicles.Any() ? Ok(vehicles) : NotFound(new { message = "No vehicles found for this user." });
        }


    }

}

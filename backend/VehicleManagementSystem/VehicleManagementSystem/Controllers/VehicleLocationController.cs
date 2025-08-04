using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Services.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace VehicleManagementSystem.Controllers
{
    [ApiController]
    [Route("api/locations")]
    public class VehicleLocationController : ControllerBase
    {
        private readonly IVehicleLocationService _service;
        public VehicleLocationController(IVehicleLocationService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> UpdateLocation([FromBody] LocationDto request)
        {
            return await _service.UpdateLocation(request);
        }

        [Authorize]
        [HttpGet("{vehicleId}/current")]
        public async Task<IActionResult> GetCurrentLocation(int vehicleId)
        {
            // Lấy userId từ token
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized(new { message = "User ID not found in token." });

            int userId = int.Parse(userIdClaim.Value);

            // Kiểm tra xem vehicle có thuộc user này không
            bool isOwned = await _service.IsVehicleOwnedByUser(vehicleId, userId);
            if (!isOwned)
                return Forbid("You do not have access to this vehicle.");

            // Lấy vị trí hiện tại
            var result = await _service.GetCurrentLocation(vehicleId);
            return result != null
                ? Ok(result)
                : NotFound(new { message = "No current location found." });
        }

        [Authorize]
        [HttpGet("{vehicleId}/history-by-time")]
        public async Task<IActionResult> GetLocationHistoryByTime(int vehicleId, DateTime startTime, DateTime endTime)
        {
            if (startTime >= endTime)
                return BadRequest("Start time must be earlier than end time.");

            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized(new { message = "User ID not found in token." });

            int userId = int.Parse(userIdClaim.Value);
            var isOwned = await _service.IsVehicleOwnedByUser(vehicleId, userId);
            if (!isOwned)
                return Forbid("You do not have access to this vehicle.");

            var history = await _service.GetLocationHistory(vehicleId, startTime, endTime);
            return history.Count == 0 ? NotFound(new { message = "No location data found." }) : Ok(history);
        }
    }
}

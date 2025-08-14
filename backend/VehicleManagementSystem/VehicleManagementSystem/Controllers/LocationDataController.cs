using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Services.Implementations;
using VehicleManagementSystem.Services.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace VehicleManagementSystem.Controllers
{
    [ApiController]
    [Route("api/locations")]
    public class LocationDataController : ControllerBase
    {
        private readonly ILocationDataService _service;
        public LocationDataController(ILocationDataService service)
        {
            _service = service;
        }


        [HttpPost("update-location")]
        public async Task<IActionResult> UpdateLocation([FromBody] LocationDataRequest request)
        {
            await _service.UpdateLocationAsync(request);
            return Ok(new ApiResponse<object>(200, "Location updated successfully", null));
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
            bool isOwned = await _service.IsVehicleOwnedByUserAsync(vehicleId, userId);
            if (!isOwned)
                return Forbid("You do not have access to this vehicle.");

            // Lấy vị trí hiện tại
            var result = await _service.GetCurrentLocationAsync(vehicleId);
            return result != null
                ? Ok(result)
                : NotFound(new { message = "No current location found." });
        }

        //[Authorize]
        [HttpGet("{vehicleId}/history-by-time")]
        public async Task<IActionResult> GetLocationHistoryByTime(int vehicleId, DateTime startTime, DateTime endTime)
        {
            // Validate date range
            if (startTime >= endTime)
                return BadRequest(new { message = "Start time must be earlier than end time." });

            // Enforce maximum 7-day range
            if ((endTime - startTime).TotalDays > 7)
                return BadRequest(new { message = "The date range cannot exceed 7 days." });

            // Extract user ID from claims
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "UserId");
            if (userIdClaim == null)
                return Unauthorized(new { message = "User ID not found in token." });

            if (!int.TryParse(userIdClaim.Value, out int userId))
                return Unauthorized(new { message = "Invalid User ID format in token." });

            // Check ownership
            var isOwned = await _service.IsVehicleOwnedByUserAsync(vehicleId, userId);
            if (!isOwned)
                return Unauthorized(new { message = "Vehicle isn't belong to this userId." });

            // Retrieve location history
            var history = await _service.GetLocationHistoryAsync(vehicleId, startTime, endTime);

            return history == null || history.Count == 0
                ? NotFound(new { message = "No location data found in the given time range." })
                : Ok(history);
        }

    }
}

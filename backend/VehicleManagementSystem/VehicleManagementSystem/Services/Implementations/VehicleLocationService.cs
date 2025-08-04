using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Services.Interfaces;

namespace VehicleManagementSystem.Services.Implementations
{
    public class VehicleLocationService : IVehicleLocationService
    {
        private readonly PostSQLDbContext _context;

        public VehicleLocationService(PostSQLDbContext context) => _context = context;

        public async Task<IActionResult> UpdateLocation(LocationDto request)
        {
            // Validate latitude and longitude
            if (request.Latitude < -90 || request.Latitude > 90)
                return new BadRequestObjectResult("Latitude must be between -90 and 90.");

            if (request.Longitude < -180 || request.Longitude > 180)
                return new BadRequestObjectResult("Longitude must be between -180 and 180.");

            var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.Id == request.VehicleId);
            if (vehicle == null)
                return new NotFoundObjectResult($"No vehicle found with ID {request.VehicleId}");

            // Add to location history
            var history = new VehicleLocation
            {
                VehicleId = request.VehicleId,
                Lat = request.Latitude,
                Long = request.Longitude,
                Timestamp = DateTime.UtcNow
            };
            await _context.VehicleLocations.AddAsync(history);

            // Update or insert latest location
            var vehicleData = await _context.VehicleDatas.FirstOrDefaultAsync(v => v.VehicleId == request.VehicleId);
            if (vehicleData == null)
            {
                vehicleData = new VehicleData
                {
                    VehicleId = request.VehicleId,
                    Lat = request.Latitude,
                    Long = request.Longitude,
                    Timestamp = DateTime.UtcNow
                };
                await _context.VehicleDatas.AddAsync(vehicleData);
            }
            else
            {
                vehicleData.Lat = request.Latitude;
                vehicleData.Long = request.Longitude;
                vehicleData.Timestamp = DateTime.UtcNow;
                _context.VehicleDatas.Update(vehicleData);
            }

            await _context.SaveChangesAsync();
            return new OkObjectResult(new { message = "Location updated successfully" });
        }

        public async Task<LocationDto?> GetCurrentLocation(int vehicleId)
        {
            var data = await _context.VehicleDatas.FirstOrDefaultAsync(v => v.VehicleId == vehicleId);
            if (data == null) return null;

            return new LocationDto
            {
                VehicleId = data.VehicleId,
                Latitude = data.Lat,
                Longitude = data.Long,
                Timestamp = data.Timestamp,
            };
        }

        public async Task<bool> IsVehicleOwnedByUser(int vehicleId, int userId)
        {
            return await _context.Vehicles
                .AnyAsync(v =>v.Id == vehicleId && v.UserId == userId);
        }

        public async Task<List<LocationDto>> GetLocationHistory(int vehicleId, DateTime startTime, DateTime endTime)
        {
            return await _context.VehicleLocations
                .Where(v => v.VehicleId == vehicleId && v.Timestamp >= startTime && v.Timestamp <= endTime)
                .OrderBy(v => v.Timestamp)
                .Select(v => new LocationDto
                {
                    VehicleId = v.VehicleId,
                    Latitude = v.Lat,
                    Longitude = v.Long,
                    Timestamp = v.Timestamp
                })
                .ToListAsync();
        }
    }

}

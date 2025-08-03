using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Models.Entities;
using VehicleManagementSystem.Services.Interfaces;

namespace VehicleManagementSystem.Services.Implementations
{
    public class VehicleService : IVehicleService
    {
        private readonly PostSQLDbContext _context;

        public VehicleService(PostSQLDbContext context) => _context = context;

        public async Task<List<VehicleDto>> GetVehiclesByUserId(int userId)
        {
            var vehicles = await _context.Vehicles
                .Where(v => v.UserId == userId)
                .Select(v => new VehicleDto
                {
                    Id = v.Id,
                    LicensePlate = v.LicensePlate,
                    IMEI = v.IMEI,
                    SimPhoneNumber = v.SimPhoneNumber,
                    VehicleType = v.VehicleType,
                    CreatedAt = v.CreatedAt,
                    UpdatedAt = v.UpdatedAt
                })
                .ToListAsync();

            return vehicles;
        }

        public async Task<IActionResult> CreateVehicle(Vehicle vehicle)
        {
            if (vehicle == null) return new BadRequestObjectResult("Vehicle is null");

            vehicle.CreatedAt = DateTime.UtcNow;
            vehicle.UpdatedAt = DateTime.UtcNow;
            await _context.Vehicles.AddAsync(vehicle);
            await _context.SaveChangesAsync();

            return new OkObjectResult(new { message = "Vehicle created successfully", vehicle });
        }

        public async Task<IActionResult> UpdateVehicle(int id, Vehicle updatedVehicle)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return new NotFoundObjectResult("Vehicle not found");

            vehicle.IMEI = updatedVehicle.IMEI;
            vehicle.LicensePlate = updatedVehicle.LicensePlate;
            vehicle.SimPhoneNumber = updatedVehicle.SimPhoneNumber;
            vehicle.Brand = updatedVehicle.Brand;
            vehicle.VehicleType = updatedVehicle.VehicleType;
            vehicle.UserId = updatedVehicle.UserId;
            vehicle.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return new OkObjectResult(new { message = "Vehicle updated successfully", vehicle });
        }

        public async Task<IActionResult> DeleteVehicle(int id)
        {
            var vehicle = await _context.Vehicles.FindAsync(id);
            if (vehicle == null) return new NotFoundObjectResult("Vehicle not found");

            _context.Vehicles.Remove(vehicle);
            await _context.SaveChangesAsync();

            return new OkObjectResult(new { message = "Vehicle deleted successfully" });
        }
    }

}

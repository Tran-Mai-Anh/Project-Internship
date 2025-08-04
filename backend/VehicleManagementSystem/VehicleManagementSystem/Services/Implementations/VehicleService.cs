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
                    UpdatedAt = v.UpdatedAt,
                    Brand = v.Brand,
                })
                .ToListAsync();

            return vehicles;
        }

    }

}

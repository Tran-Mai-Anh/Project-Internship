using Microsoft.AspNetCore.Mvc;
using VehicleManagementSystem.Models.DTO;

namespace VehicleManagementSystem.Services.Interfaces
{
    public interface IVehicleService
    {
        Task<List<VehicleDto>> GetVehiclesByUserId(int userId);
        Task<IActionResult> CreateVehicle(Vehicle vehicle);
        Task<IActionResult> UpdateVehicle(int id, Vehicle updatedVehicle);
        Task<IActionResult> DeleteVehicle(int id);
    }
}

using Microsoft.AspNetCore.Mvc;

namespace VehicleManagementSystem.Services.Interfaces
{
    public interface IVehicleService
    {
        Task<IActionResult> CreateVehicle(Vehicle vehicle);
        Task<IActionResult> UpdateVehicle(int id, Vehicle updatedVehicle);
        Task<IActionResult> DeleteVehicle(int id);
    }
}

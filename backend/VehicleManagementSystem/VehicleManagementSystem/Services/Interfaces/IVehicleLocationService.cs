using Microsoft.AspNetCore.Mvc;
using VehicleManagementSystem.Models.DTO;

namespace VehicleManagementSystem.Services.Interfaces
{
    public interface IVehicleLocationService
    {
        Task<IActionResult> UpdateLocation(LocationDto request);
        Task<LocationDto?> GetCurrentLocation(int vehicleId);
        Task<bool> IsVehicleOwnedByUser(int vehicleId, int userId);
        Task<List<LocationDto>> GetLocationHistory(int vehicleId, DateTime startTime, DateTime endTime);
    }
}

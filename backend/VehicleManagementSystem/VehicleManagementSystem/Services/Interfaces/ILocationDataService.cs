using Microsoft.AspNetCore.Mvc;
using VehicleManagementSystem.Models.DTO;

namespace VehicleManagementSystem.Services.Interfaces
{
    public interface ILocationDataService
    {
        Task UpdateLocationAsync(LocationDataRequest request);
        Task<LocationDataRequest?> GetCurrentLocationAsync(int vehicleId);
        Task<bool> IsVehicleOwnedByUserAsync(int vehicleId, int userId);
        Task<List<TripSegment>> GetLocationHistoryAsync(int vehicleId, DateTime startTime, DateTime endTime);
    }
}

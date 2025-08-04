using Microsoft.AspNetCore.Mvc;
using VehicleManagementSystem.Models.DTO;

namespace VehicleManagementSystem.Services.Interfaces
{
    public interface IVehicleService
    {
       public Task<List<VehicleDto>> GetVehiclesByUserId(int userId);
       //public Task<int> AddVehicleToUserAsync(int userId,VehicleDto vehicle);
        //Task<bool> UpdateVehicle(int id, Vehicle updatedVehicle);
        //Task<bool> DeleteVehicle(int id);
    }
}

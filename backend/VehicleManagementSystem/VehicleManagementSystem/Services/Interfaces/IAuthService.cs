using Microsoft.AspNetCore.Mvc;
using VehicleManagementSystem.Models.DTO;

namespace VehicleManagementSystem.Services.Interfaces
{
    public interface IAuthService
    {
        Task<IActionResult> Login(LoginRequest request);
        Task<IActionResult> RegisterWithVehicle(RegisterRequest request);
    }
}

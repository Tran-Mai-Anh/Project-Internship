using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Services.Interfaces;

namespace VehicleManagementSystem.Controllers
{
    [ApiController]
    [Route("api/vehicles")]
    public class VehiclesController : ControllerBase
    {
        private readonly IVehicleService _service;

        public VehiclesController(IVehicleService service) => _service = service;

        [HttpPost]
        public async Task<IActionResult> CreateVehicle([FromBody] Vehicle vehicle) => await _service.CreateVehicle(vehicle);

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateVehicle(int id, [FromBody] Vehicle vehicle) => await _service.UpdateVehicle(id, vehicle);

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteVehicle(int id) => await _service.DeleteVehicle(id);
    }

}

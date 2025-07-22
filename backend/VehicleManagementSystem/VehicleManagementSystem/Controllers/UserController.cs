using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Models.Entities;

namespace VehicleManagementSystem.Controllers
{
    [ApiController]
    [Route("api")]
    public class UsersController : ControllerBase
    {
        private readonly PostSQLDbContext _context;

        public UsersController(PostSQLDbContext context)
        {
            _context = context;
        }

        [HttpGet("users")]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }
    }

}

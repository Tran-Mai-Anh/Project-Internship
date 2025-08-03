using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Models.Entities;
using VehicleManagementSystem.Services.Interfaces;
using VehicleManagementSystem.Models.DTO;
namespace VehicleManagementSystem.Services.Implementations
{
    public class AuthService : IAuthService
    {
        private readonly IConfiguration _config;
        private readonly PostSQLDbContext _context;

        public AuthService(IConfiguration config, PostSQLDbContext context)
        {
            _config = config;
            _context = context;
        }

        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.Password))
                return new UnauthorizedObjectResult("Invalid email or password");

            string token = GenerateJwtToken(user);
            return new OkObjectResult(new { token });
        }

        private string GenerateJwtToken(User user)
        {
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]);
            var claims = new[]
            {
            new Claim(ClaimTypes.Name, user.Email),
            new Claim("UserId", user.Id.ToString())
        };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(4),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        public async Task<IActionResult> RegisterWithVehicle(RegisterRequest request)
        {
            // Basic validation for empty or null fields
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.IMEI) ||
                string.IsNullOrWhiteSpace(request.LicensePlate) ||
                string.IsNullOrWhiteSpace(request.SimPhoneNumber) ||
                string.IsNullOrWhiteSpace(request.VehicleType))
            {
                return new BadRequestObjectResult(new { message = "Please fill in all required fields." });
            }

            // SIM phone number: only digits, and length = 10 or 11
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.SimPhoneNumber, @"^\d{10,11}$"))
            {
                return new BadRequestObjectResult(new { message = "SIM phone number must be 10 or 11 digits." });
            }

            // Email format validation (simple regex)
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return new BadRequestObjectResult(new { message = "Invalid email format." });
            }

            // Password length validation
            if (!System.Text.RegularExpressions.Regex.IsMatch(request.Password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"))
            {
                return new BadRequestObjectResult(new
                {
                    message = "Invalid password."
                });
            }

            // Confirm password match
            if (request.Password != request.ConfirmPassword)
            {
                return new BadRequestObjectResult(new { message = "Password and confirm password do not match." });
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(x => x.Email == request.Email))
            {
                return new BadRequestObjectResult(new { message = "Email already exists." });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Create user entity
                var user = new User
                {
                    Name = request.Name,
                    Email = request.Email,
                    Address = request.Address,
                    Password = BCrypt.Net.BCrypt.HashPassword(request.Password)
                };

                // Get default role
                var role = await _context.Role.FirstOrDefaultAsync(r => r.RoleName == "User");
                if (role == null)
                {
                    return new BadRequestObjectResult(new { message = "Default role not found." });
                }

                user.UserRoles = new List<UserRole> { new UserRole { User = user, Role = role } };

                // Create vehicle entity
                var vehicle = new Vehicle
                {
                    IMEI = request.IMEI,
                    LicensePlate = request.LicensePlate,
                    SimPhoneNumber = request.SimPhoneNumber,
                    Brand = request.Brand,
                    VehicleType = request.VehicleType,
                    User = user,
                    CreatedAt = DateTime.UtcNow,
                };

                user.Vehicles = new List<Vehicle> { vehicle };

                // Save to database
                _context.Users.Add(user);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return new OkObjectResult(new { message = "User and vehicle registered successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ObjectResult(new { message = "Failed to register user and vehicle", error = ex.Message })
                {
                    StatusCode = 500
                };
            }
        }
    }
}

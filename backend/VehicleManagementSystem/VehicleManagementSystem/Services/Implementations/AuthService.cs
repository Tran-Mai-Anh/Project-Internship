using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Models.Entities;
using VehicleManagementSystem.Services.Implementations;
using VehicleManagementSystem.Services.Interfaces;

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

        public async Task<IActionResult> RegisterUserAndVehicleAsync(RegisterRequest request)
        {
            var validationResult = await ValidateRegisterRequestAsync(request);
            if (validationResult != null) return validationResult;

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var user = await CreateUserAsync(request);
                await AddVehicleToUserAsync(user.Id, request);

                await transaction.CommitAsync();
                return new OkObjectResult(new { message = "User and vehicle registered successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return new ObjectResult(new { message = "Registration failed", error = ex.Message }) { StatusCode = 500 };
            }
        }

    
        private async Task<IActionResult?> ValidateRegisterRequestAsync(RegisterRequest request)
        {
            // Check for required fields
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password) ||
                string.IsNullOrWhiteSpace(request.ConfirmPassword) ||
                string.IsNullOrWhiteSpace(request.IMEI) ||
                string.IsNullOrWhiteSpace(request.LicensePlate) ||
                string.IsNullOrWhiteSpace(request.SimPhoneNumber) ||
                string.IsNullOrWhiteSpace(request.VehicleType))
            {
                return new BadRequestObjectResult(new { message = "Please fill in all required fields." });
            }

            // SIM phone number must be 10 or 11 digits
            if (!Regex.IsMatch(request.SimPhoneNumber, @"^\d{10,11}$"))
            {
                return new BadRequestObjectResult(new { message = "SIM phone number must be 10 or 11 digits." });
            }

            // Validate email format
            if (!Regex.IsMatch(request.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
            {
                return new BadRequestObjectResult(new { message = "Invalid email format." });
            }

            // Validate password strength (min 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char)
            if (!Regex.IsMatch(request.Password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"))
            {
                return new BadRequestObjectResult(new
                {
                    message = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
                });
            }

            // Password confirmation check
            if (request.Password != request.ConfirmPassword)
            {
                return new BadRequestObjectResult(new { message = "Password and confirm password do not match." });
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(x => x.Email == request.Email))
            {
                return new BadRequestObjectResult(new { message = "Email already exists." });
            }

            // Check for duplicate IMEI
            if (await _context.Vehicles.AnyAsync(v => v.IMEI == request.IMEI))
            {
                return new BadRequestObjectResult(new { message = "IMEI already exists." });
            }

            // Check for duplicate License Plate
            if (await _context.Vehicles.AnyAsync(v => v.LicensePlate == request.LicensePlate))
            {
                return new BadRequestObjectResult(new { message = "License plate already exists." });
            }

            return null;
        }

        private async Task<User> CreateUserAsync(RegisterRequest request)
        {
            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Address = request.Address,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
            };

            var role = await _context.Role.FirstOrDefaultAsync(r => r.RoleName == "User");
            if (role == null) throw new Exception("Default role not found.");

            user.UserRoles = new List<UserRole> { new UserRole { User = user, Role = role } };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private async Task AddVehicleToUserAsync(int userId, RegisterRequest request)
        {
            var vehicle = new Vehicle
            {
                UserId = userId,
                IMEI = request.IMEI,
                LicensePlate = request.LicensePlate,
                SimPhoneNumber = request.SimPhoneNumber,
                VehicleType = request.VehicleType,
                Brand = request.Brand,
                CreatedAt = DateTime.UtcNow
            };

            _context.Vehicles.Add(vehicle);
            await _context.SaveChangesAsync();
        }

    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Exceptions;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Models.Entities;
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
                throw new UnauthorizedException("Invalid email or password");

            var token = GenerateJwtToken(user);

            var response = new ApiResponse<object>(
                statusCode: 200,
                message: "Login successful",
                data: new { token }
            );

            return new OkObjectResult(response);
        }

        //public async Task<IActionResult> RegisterUserAndVehicleAsync(RegisterRequest request)
        //{
        //    await ValidateRegisterRequestAsync(request);

        //    await using var transaction = await _context.Database.BeginTransactionAsync();
        //    try
        //    {
        //        var user = await CreateUserAsync(request);
        //        await AddVehicleToUserAsync(user.Id, request);

        //        await transaction.CommitAsync();

        //        var response = new ApiResponse<object>(
        //            statusCode: 201,
        //            message: "Registration successful",
        //            data: null
        //        );

        //        return new OkObjectResult(response);
        //    }
        //    catch (Exception)
        //    {
        //        await transaction.RollbackAsync();
        //        throw new InternalServerErrorException("An unexpected error occurred. Please try again later.");
        //    }
        //}

        public async Task<IActionResult> RegisterUserAndVehicleAsync(RegisterRequest request)
        {
            await ValidateRegisterRequestAsync(request);

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // 1. Create user
                var user = await CreateUserAsync(request);

                // 2. Create vehicle and get it back
                var vehicle = await AddVehicleToUserAsync(user.Id, request);

                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                var response = new ApiResponse<object>(
                    statusCode: 200,
                    message: "Registration successful",
                    data: null
                );

                return new OkObjectResult(response);
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
                throw new InternalServerErrorException("An unexpected error occurred. Please try again later.");
            }
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
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            return tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));
        }

        private async Task ValidateRegisterRequestAsync(RegisterRequest request)
        {
            var errors = new List<FieldError>();

            if (string.IsNullOrWhiteSpace(request.Name))
                errors.Add(new FieldError { Field = "Name", Error = "Name is required." });
            if (string.IsNullOrWhiteSpace(request.Email))
                errors.Add(new FieldError { Field = "Email", Error = "Email is required." });
            if (string.IsNullOrWhiteSpace(request.Password))
                errors.Add(new FieldError { Field = "Password", Error = "Password is required." });
            if (string.IsNullOrWhiteSpace(request.ConfirmPassword))
                errors.Add(new FieldError { Field = "ConfirmPassword", Error = "Confirm password is required." });
            if (string.IsNullOrWhiteSpace(request.IMEI))
                errors.Add(new FieldError { Field = "IMEI", Error = "IMEI is required." });
            if (string.IsNullOrWhiteSpace(request.LicensePlate))
                errors.Add(new FieldError { Field = "LicensePlate", Error = "License plate is required." });
            if (string.IsNullOrWhiteSpace(request.SimPhoneNumber))
                errors.Add(new FieldError { Field = "SimPhoneNumber", Error = "SIM phone number is required." });
            if (string.IsNullOrWhiteSpace(request.VehicleType))
                errors.Add(new FieldError { Field = "VehicleType", Error = "Vehicle type is required." });

            if (!string.IsNullOrWhiteSpace(request.SimPhoneNumber) &&
                !Regex.IsMatch(request.SimPhoneNumber, @"^\d{10,11}$"))
                errors.Add(new FieldError { Field = "SimPhoneNumber", Error = "SIM phone number must be 10 or 11 digits." });

            if (!string.IsNullOrWhiteSpace(request.Email) &&
                !Regex.IsMatch(request.Email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$"))
                errors.Add(new FieldError { Field = "Email", Error = "Invalid email format." });

            if (!string.IsNullOrWhiteSpace(request.Password) &&
                !Regex.IsMatch(request.Password, @"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$"))
                errors.Add(new FieldError { Field = "Password", Error = "Password must be at least 8 characters and include uppercase, lowercase, number, and special character." });

            if (request.Password != request.ConfirmPassword)
                errors.Add(new FieldError { Field = "ConfirmPassword", Error = "Password and confirm password do not match." });

            if (await _context.Users.AnyAsync(x => x.Email == request.Email))
                errors.Add(new FieldError { Field = "Email", Error = "Email already exists." });

            if (await _context.Vehicles.AnyAsync(v => v.IMEI == request.IMEI))
                errors.Add(new FieldError { Field = "IMEI", Error = "IMEI already exists." });

            if (await _context.Vehicles.AnyAsync(v => v.LicensePlate == request.LicensePlate))
                errors.Add(new FieldError { Field = "LicensePlate", Error = "License plate already exists." });

            if (errors.Any())
                throw new BadRequestException("Validation failed", errors);
        }

        private async Task<User> CreateUserAsync(RegisterRequest request)
        {
            var role = await _context.Role.FirstOrDefaultAsync(r => r.RoleName == "User");
            if (role == null)
                throw new InternalServerErrorException("Default role not found.");

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                Address = request.Address,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                UserRoles = new List<UserRole> { new UserRole { Role = role } }
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return user;
        }

        private async Task<Vehicle> AddVehicleToUserAsync(int userId, RegisterRequest request)
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

            return vehicle; // return for later use
        }

    }
}

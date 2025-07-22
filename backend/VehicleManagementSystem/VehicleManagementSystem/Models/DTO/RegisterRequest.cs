namespace VehicleManagementSystem.Models.DTO
{
    public class RegisterRequest
    {
        // User Info
        public string Name { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string Password { get; set; }

        // Vehicle Info
        public string IMEI { get; set; }
        public string LicensePlate { get; set; }
        public string SimPhoneNumber { get; set; }
        public string? Brand { get; set; }
        public string VehicleType { get; set; }
    }
}

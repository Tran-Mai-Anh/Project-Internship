namespace VehicleManagementSystem.Models.DTO
{
    public class VehicleDto
    {
        public int Id { get; set; }
        public string IMEI { get; set; }
        public string LicensePlate { get; set; }
        public string SimPhoneNumber { get; set; }
        public string? Brand { get; set; }
        public string VehicleType { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}

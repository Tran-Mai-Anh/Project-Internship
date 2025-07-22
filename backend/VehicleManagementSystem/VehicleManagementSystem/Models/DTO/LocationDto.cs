namespace VehicleManagementSystem.Models.DTO
{
    public class LocationDto
    {
        public int VehicleId { get; set; }  // ID của xe từ bảng Vehicle

        public double Latitude { get; set; }  // Vĩ độ hiện tại

        public double Longitude { get; set; } // Kinh độ hiện tại
        public DateTime? Timestamp { get; set; }

    }

}

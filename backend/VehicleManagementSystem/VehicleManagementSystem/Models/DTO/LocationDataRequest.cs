using System.ComponentModel.DataAnnotations;

namespace VehicleManagementSystem.Models.DTO
{
    public class LocationDataRequest
    {
      
        [Required]
        public string IMEI { get; set; }
        public int Pin { get; set; }
        public double Latitude { get; set; }  // Vĩ độ hiện tại

        public double Longitude { get; set; } // Kinh độ hiện tại
        public DateTime? Timestamp { get; set; }
        public double Speed { get; set; }

    }

}

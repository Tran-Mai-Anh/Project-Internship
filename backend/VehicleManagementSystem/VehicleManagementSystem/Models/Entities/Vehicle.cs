using System.ComponentModel.DataAnnotations;
using VehicleManagementSystem.Models.Entities;

public class Vehicle
{
    public int Id { get; set; }

    [Required]
    public string IMEI { get; set; }

    [Required]
    public string LicensePlate { get; set; }

    [Required]
    public string SimPhoneNumber { get; set; }

    public string? Brand { get; set; }

    public string VehicleType { get; set; }

    public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public int? UserId { get; set; }
    public User? User { get; set; }
    //public ICollection<VehicleData>? VehicleDatas { get; set; }
    public ICollection<LocationData>? VehicleLocations { get; set; }

}

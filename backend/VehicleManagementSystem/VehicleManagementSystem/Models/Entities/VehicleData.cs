using System.ComponentModel.DataAnnotations;
using VehicleManagementSystem.Models;

public class VehicleData
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int VehicleId { get; set; }
    public Vehicle Vehicle { get; set; }

    public int CAN_ID { get; set; }
    public int DLC { get; set; }

    public DateTime Timestamp { get; set; }

    public int? Speed { get; set; }
    public int? RPM { get; set; }
    public decimal? FuelLevel { get; set; }
    public int? EngineTemp { get; set; }
    public bool? DoorStatus { get; set; }

    public double Lat { get; set; }
    public double Long { get; set; }

    public ICollection<VehicleLocation>? VehicleLocations { get; set; }
}

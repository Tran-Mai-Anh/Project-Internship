using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;


[Index(nameof(VehicleId), nameof(Timestamp))]
public class LocationData
{
    public int Id { get; set; }
    public string IMEI { get; set; }
    public int Pin { get; set; }

    [Required]
    public int VehicleId { get; set; }
    public Vehicle? Vehicle { get; set; }

    public double Lat { get; set; }
    public double Long { get; set; }
    public double Speed { get; set; }
    public DateTime Timestamp { get; set; }
}

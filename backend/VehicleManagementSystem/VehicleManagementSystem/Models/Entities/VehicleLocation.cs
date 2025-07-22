using System.ComponentModel.DataAnnotations;

public class VehicleLocation
{
    public int Id { get; set; }

    [Required]
    public int VehicleId { get; set; }
    public Vehicle Vehicle { get; set; }

    public double Lat { get; set; }
    public double Long { get; set; }

    public DateTime Timestamp { get; set; }
}

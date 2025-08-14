namespace VehicleManagementSystem.Models.DTO
{
    public class TripSegment
    {
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string Type { get; set; } // "Driving" or "Stop"
        public double DistanceKm { get; set; }
        public double AverageSpeed { get; set; }
        public double MaxSpeed { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
    }
}

using Microsoft.EntityFrameworkCore;
using System.Globalization;
using System.Text.Json;
using VehicleManagementSystem.Data;
using VehicleManagementSystem.Exceptions;
using VehicleManagementSystem.Models.DTO;
using VehicleManagementSystem.Models.Entities;
using VehicleManagementSystem.Services.Interfaces;

namespace VehicleManagementSystem.Services.Implementations
{
    public class LocationDataService : ILocationDataService
    {
        private readonly PostSQLDbContext _context;
        private readonly HttpClient _httpClient;

        public LocationDataService(PostSQLDbContext context, IHttpClientFactory httpClientFactory)
        {
            _context = context;
            _httpClient = httpClientFactory.CreateClient();
            _httpClient.DefaultRequestHeaders.UserAgent.ParseAdd("VehicleSystem/1.0 (thanhhuyenbb4683@gmail.com)");
        }

        public async Task UpdateLocationAsync(LocationDataRequest request)
        {
            var errors = new List<FieldError>();

            // Validate coordinates
            if (request.Latitude < -90 || request.Latitude > 90)
                errors.Add(new FieldError { Field = "Latitude", Error = "Latitude must be between -90 and 90." });

            if (request.Longitude < -180 || request.Longitude > 180)
                errors.Add(new FieldError { Field = "Longitude", Error = "Longitude must be between -180 and 180." });

            if (request.Speed < 0)
                errors.Add(new FieldError { Field = "Speed", Error = "Speed must not be less than 0." });

            var vehicle = await _context.Vehicles.FirstOrDefaultAsync(v => v.IMEI == request.IMEI);

            if (vehicle == null)
                errors.Add(new FieldError { Field = "Vehicle", Error = $"No vehicle found with imei {request.IMEI}" });

            // If any validation errors, throw exception
            if (errors.Any())
                throw new BadRequestException("Validation failed", errors);

            try
            {
                var history = new LocationData
                {
                    VehicleId = vehicle.Id,
                    Pin = request.Pin,
                    IMEI = request.IMEI,
                    Lat = request.Latitude,
                    Long = request.Longitude,
                    Speed = request.Speed,
                    Timestamp = DateTime.UtcNow
                };
                await _context.VehicleLocations.AddAsync(history);

                await _context.SaveChangesAsync();
            }
            catch
            {
                throw; // Let the middleware handle it
            }
        }

        public async Task<LocationDataRequest?> GetCurrentLocationAsync(int vehicleId)
        {
            var data = await _context.VehicleLocations
                                  .Where(v => v.VehicleId == vehicleId)
                                  .OrderByDescending(v => v.Timestamp)
                                  .FirstOrDefaultAsync();

            if (data == null) return null;

            var locationName = await GetLocationNameAsync(data.Lat, data.Long);

            return new LocationDataRequest
            {
                Latitude = data.Lat,
                Longitude = data.Long,
                Pin = data.Pin,
                IMEI = data.IMEI,
                Speed = data.Speed,
                Timestamp = data.Timestamp,
                Location = locationName
            };
        }

        public async Task<bool> IsVehicleOwnedByUserAsync(int vehicleId, int userId)
        {
            return await _context.Vehicles
                .AnyAsync(v => v.Id == vehicleId && v.UserId == userId);
        }

        public async Task<List<TripSegment>> GetLocationHistoryAsync(int vehicleId, DateTime startTime, DateTime endTime)
        {
            var locations = await _context.VehicleLocations
                .Where(v => v.VehicleId == vehicleId && v.Timestamp >= startTime && v.Timestamp <= endTime)
                .OrderBy(v => v.Timestamp)
                .ToListAsync();


            var result = new List<TripSegment>();

            if (!locations.Any())
                return result;

            TripSegment? currentSegment = null;
            bool isDriving = locations.First().Speed > 0;

            foreach (var loc in locations)
            {
                bool nowDriving = loc.Speed > 0;

                if (currentSegment == null)
                {
                    currentSegment = new TripSegment
                    {
                        StartTime = loc.Timestamp,
                        Type = nowDriving ? "Driving" : "Stop",
                        Latitude = loc.Lat,
                        Longitude = loc.Long,
                        Location = await GetLocationNameAsync(loc.Lat, loc.Long)
                    };
                }

                if (nowDriving != isDriving)
                {
                    currentSegment.EndTime = loc.Timestamp;
                    result.Add(currentSegment);

                    currentSegment = new TripSegment
                    {
                        StartTime = loc.Timestamp,
                        Type = nowDriving ? "Driving" : "Stop",
                        Latitude = loc.Lat,
                        Longitude = loc.Long,
                        Location = await GetLocationNameAsync(loc.Lat, loc.Long)
                    };

                    isDriving = nowDriving;
                }

                if (nowDriving)
                {
                    var lastIndex = locations.IndexOf(loc);
                    if (lastIndex > 0)
                    {
                        var prevPoint = locations[lastIndex - 1];
                        currentSegment.DistanceKm += CalculateDistance(prevPoint.Lat, prevPoint.Long, loc.Lat, loc.Long);
                    }

                    currentSegment.AverageSpeed = ((currentSegment.AverageSpeed * (currentSegment.DistanceKm > 0 ? 1 : 0)) + loc.Speed) / 2;
                    if (loc.Speed > currentSegment.MaxSpeed)
                        currentSegment.MaxSpeed = loc.Speed;
                }
            }

            // Add last segment if it exists
            if (currentSegment != null)
            {
                currentSegment.EndTime = locations.Last().Timestamp;
                result.Add(currentSegment);
            }

            return result; // Returns [] if no segment was found
        }

        private double CalculateDistance(double lat1, double lon1, double lat2, double lon2)
        {
            const double R = 6371; // km
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.Sin(dLat / 2) * Math.Sin(dLat / 2) +
                    Math.Cos(lat1 * Math.PI / 180) * Math.Cos(lat2 * Math.PI / 180) *
                    Math.Sin(dLon / 2) * Math.Sin(dLon / 2);
            var c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));
            return R * c;
        }

        public async Task<string> GetLocationNameAsync(double latitude, double longitude)
        {
            try
            {
                string apiKey = "pk.56cb7bd3dc8593cb4fe5b9632f447ab7";
                string url = $"https://us1.locationiq.com/v1/reverse.php?key={apiKey}&lat={latitude.ToString(CultureInfo.InvariantCulture)}&lon={longitude.ToString(CultureInfo.InvariantCulture)}&format=json";

                var response = await _httpClient.GetAsync(url);
                if (!response.IsSuccessStatusCode)
                {
                    // Return fallback instead of error
                    return "Unknown location";
                }

                var json = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(json);

                if (doc.RootElement.TryGetProperty("display_name", out var displayName))
                {
                    return displayName.GetString() ?? "Unknown location";
                }

                return "Unknown location";
            }
            catch
            {
                return "Unknown location";
            }
        }
    }
}

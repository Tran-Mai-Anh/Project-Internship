using VehicleManagementSystem.Models.DTO;

namespace VehicleManagementSystem.Exceptions
{
    public class BadRequestException : Exception
    {
        public List<FieldError> Errors { get; }

        public BadRequestException(string message, List<FieldError> errors = null) : base(message)
        {
            Errors = errors ?? new List<FieldError>();
        }
    }
}

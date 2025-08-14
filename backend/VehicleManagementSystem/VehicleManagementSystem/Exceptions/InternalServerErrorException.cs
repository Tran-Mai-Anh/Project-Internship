namespace VehicleManagementSystem.Exceptions
{
    public class InternalServerErrorException : Exception
    {
        public InternalServerErrorException(string message = "An unexpected error occurred.")
           : base(message)
        {
        }
    }
}

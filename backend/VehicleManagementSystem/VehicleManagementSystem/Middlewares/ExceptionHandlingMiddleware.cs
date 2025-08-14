using System.Net;
using System.Text.Json;
using VehicleManagementSystem.Exceptions;

namespace VehicleManagementSystem.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = context.Response;
            object errorResponse;

            switch (exception)
            {
                case BadRequestException badRequest:
                    response.StatusCode = (int)HttpStatusCode.BadRequest;
                    errorResponse = new
                    {
                        statusCode = response.StatusCode,
                        message = badRequest.Message,
                        errors = badRequest.Errors
                    };
                    break;

                case UnauthorizedException unauthorized:
                    response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    errorResponse = new
                    {
                        statusCode = response.StatusCode,
                        message = unauthorized.Message
                    };
                    break;

                case NotFoundException notFound:
                    response.StatusCode = (int)HttpStatusCode.NotFound;
                    errorResponse = new
                    {
                        statusCode = response.StatusCode,
                        message = notFound.Message
                    };
                    break;

                default:
                    response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    errorResponse = new
                    {
                        statusCode = response.StatusCode,
                        message = "Something went wrong. Please try again later."
                    };
                    break;
            }

            var result = JsonSerializer.Serialize(errorResponse);
            return response.WriteAsync(result);
        }
    }
}

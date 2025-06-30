namespace HotelReservation.Helpers
{
 
        public class ApiResponse<T>
        {
            public bool Success { get; set; }
            public string Message { get; set; }
            public T Data { get; set; }

            public ApiResponse(bool success, string message, T data)
            {
                Success = success;
                Message = message;
                Data = data;
            }

            public static ApiResponse<T> Ok(T data, string message = "Success") => new(true, message, data);
            public static ApiResponse<T> Fail(string message) => new(false, message, default);
        }
    
}

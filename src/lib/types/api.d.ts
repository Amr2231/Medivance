declare type successResponse<T> = {
  message: string;
} & T;

declare interface ErrorResponse {
  error: string;
  message: string;
  code: number;
}

declare type ApiResponse<T> = successResponse<T> | ErrorResponse;

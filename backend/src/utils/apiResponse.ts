/**
 * Standard API Response wrapper
 */
export class ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  statusCode: number;

  constructor(
    statusCode: number,
    data: T | null,
    message: string = 'Success'
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success<T>(data: T, message: string = 'Success', statusCode: number = 200) {
    return new ApiResponse<T>(statusCode, data, message);
  }

  static created<T>(data: T, message: string = 'Created successfully') {
    return new ApiResponse<T>(201, data, message);
  }

  static noContent(message: string = 'No content') {
    return new ApiResponse(204, null, message);
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  statusCode: number;
  data: unknown;
  success: boolean;
  errors: string[];

  constructor(
    statusCode: number,
    message: string = 'Something went wrong',
    errors: string[] = [],
    stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message: string = 'Bad request', errors: string[] = []) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new ApiError(403, message);
  }

  static notFound(message: string = 'Not found') {
    return new ApiError(404, message);
  }

  static conflict(message: string = 'Conflict') {
    return new ApiError(409, message);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message);
  }
}

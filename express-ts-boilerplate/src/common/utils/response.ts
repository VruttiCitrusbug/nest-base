import { Response } from 'express';

/**
 * Standardized API Response Interface
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
  message?: string;
  timestamp: string;
}

/**
 * Success Response Formatter
 *
 * Creates a standardized success response structure
 * Usage: return successResponse(res, data, 'User created successfully', 201)
 */
export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Error Response Formatter
 *
 * Creates a standardized error response structure
 * Usage: return errorResponse(res, 'Invalid input', 400, 'VALIDATION_ERROR', details)
 */
export const errorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500,
  code?: string,
  details?: any
): Response => {
  const response: ApiResponse = {
    success: false,
    error: {
      message,
      code,
      details,
    },
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Paginated Response Formatter
 *
 * Creates a response with pagination metadata
 */
export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export const paginatedResponse = <T>(
  res: Response,
  items: T[],
  pagination: PaginationMeta,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<PaginatedResponse<T>> = {
    success: true,
    data: {
      items,
      pagination,
    },
    message,
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Standard API Response Interface
 * 
 * All successful API responses follow this structure for consistency.
 * This makes it easier for frontend developers to handle responses predictably.
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

/**
 * Pagination Metadata Interface
 * 
 * Used when returning paginated lists of data
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * Paginated Response Interface
 * 
 * Extends ApiResponse to include pagination metadata
 */
export interface PaginatedResponse<T = any> extends ApiResponse<T> {
  pagination?: PaginationMeta;
}

/**
 * Error Response Interface
 * 
 * Structure for error responses
 */
export interface ErrorResponse {
  success: false;
  message: string;
  errors?: any[];
}

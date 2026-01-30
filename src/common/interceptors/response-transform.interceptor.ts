import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponse } from '../interfaces/api-response.interface';

/**
 * Response Transform Interceptor
 * 
 * This interceptor wraps all successful responses in a consistent format.
 * It runs AFTER the route handler but BEFORE the response is sent to the client.
 * 
 * Why use an interceptor instead of doing this in each controller?
 * - DRY: Don't repeat this logic in every endpoint
 * - Consistency: Guaranteed uniform response structure
 * - Separation of concerns: Controllers focus on business logic, interceptor handles formatting
 * - Easy to modify: Change response format in one place
 * 
 * NestJS vs Express:
 * In Express, you might create a wrapper function or middleware.
 * In NestJS, interceptors are more powerful:
 * - They have access to both request and response
 * - They can transform the response data
 * - They work with RxJS observables (functional reactive programming)
 * - They integrate with NestJS's execution context
 * 
 * Request Lifecycle in NestJS:
 * 1. Incoming Request
 * 2. Middleware
 * 3. Guards (authentication/authorization)
 * 4. Interceptors (before) ← This runs first
 * 5. Pipes (validation/transformation)
 * 6. Route Handler (your controller method)
 * 7. Interceptors (after) ← This interceptor runs here
 * 8. Exception Filters (if error occurred)
 * 9. Response sent to client
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  private readonly logger = new Logger(ResponseTransformInterceptor.name);

  /**
   * Generate a contextual success message based on HTTP method and path
   */
  private generateSuccessMessage(method: string, path: string): string {
    // Extract resource name from path (e.g., /api/users -> users)
    const segments = path.split('/').filter(Boolean);
    const resource = segments[segments.length - 1] || 'resource';
    
    // Remove IDs and params from resource name
    const cleanResource = resource.replace(/[0-9a-f-]{36}/gi, '').replace(/\d+/g, '');
    
    // Generate contextual message based on HTTP method
    switch (method.toUpperCase()) {
      case 'GET':
        return `${this.capitalize(cleanResource)} retrieved successfully`;
      case 'POST':
        return `${this.capitalize(cleanResource)} created successfully`;
      case 'PUT':
      case 'PATCH':
        return `${this.capitalize(cleanResource)} updated successfully`;
      case 'DELETE':
        return `${this.capitalize(cleanResource)} deleted successfully`;
      default:
        return 'Operation completed successfully';
    }
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        // Calculate response time
        const responseTime = Date.now() - now;

        // Log successful requests
        this.logger.log(
          `${request.method} ${request.url} - ${responseTime}ms`,
        );

        // If the data is already wrapped (e.g., from a specific controller method)
        // don't wrap it again
        if (data && data.hasOwnProperty('success') && data.hasOwnProperty('message')) {
          return data;
        }

        // Generate default message if not provided
        const defaultMessage = this.generateSuccessMessage(
          request.method,
          request.path,
        );

        // Standard response format
        const response: ApiResponse<T> = {
          success: true,
          message: data?.message || defaultMessage,
          data: data?.message ? data.data : data, // If custom message provided, data is nested
        };

        return response;
      }),
    );
  }
}

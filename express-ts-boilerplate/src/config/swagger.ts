import swaggerJsdoc from 'swagger-jsdoc';
import { env } from 'config/env';

/**
 * Swagger/OpenAPI Configuration
 *
 * Generates API documentation from JSDoc comments in route files
 * Accessible at /api-docs endpoint
 */

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express TypeScript API',
    version: '1.0.0',
    description: `
Production-ready Express.js + TypeScript + Sequelize API boilerplate with comprehensive validation, 
error handling, and best practices.

## Features
- 🔐 Input validation using class-validator
- 🛡️ Global error handling
- 📦 Standardized response format
- 🗃️ Database migrations and seeders
- 🏗️ Layered architecture (Repository → Service → Controller)
- 📝 Automatic API documentation
    `,
    contact: {
      name: 'API Support',
      email: 'support@example.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: `http://localhost:${env.PORT || 3000}/api`,
      description: 'Development server',
    },
    {
      url: 'https://api.production.com/api',
      description: 'Production server',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'User management endpoints',
    },
    {
      name: 'Authentication',
      description: 'Authentication and authorization examples (JWT + role-based access)',
    },
    {
      name: 'Health',
      description: 'Health check endpoints',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token. You can obtain a token by authenticating with your credentials.',
      },
    },
    schemas: {
      // Success Response
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          data: {
            type: 'object',
          },
          message: {
            type: 'string',
            example: 'Operation successful',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-21T12:30:00.000Z',
          },
        },
      },

      // Error Response
      ErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Error message',
              },
              code: {
                type: 'string',
                example: 'ERROR_CODE',
              },
              details: {
                type: 'object',
              },
            },
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            example: '2026-01-21T12:30:00.000Z',
          },
        },
      },

      // Validation Error Response
      ValidationErrorResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: false,
          },
          error: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                example: 'Validation failed',
              },
              code: {
                type: 'string',
                example: 'VALIDATION_ERROR',
              },
              details: {
                type: 'object',
                properties: {
                  errors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        field: {
                          type: 'string',
                          example: 'email',
                        },
                        constraints: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          example: ['Invalid email format'],
                        },
                        value: {
                          type: 'string',
                          example: 'invalid-email',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // User Schema
      User: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440001',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'user@example.com',
          },
          firstName: {
            type: 'string',
            example: 'John',
          },
          lastName: {
            type: 'string',
            example: 'Doe',
          },
          isActive: {
            type: 'boolean',
            example: true,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
          },
        },
      },

      // Create User DTO
      CreateUserDto: {
        type: 'object',
        required: ['email', 'password', 'firstName', 'lastName'],
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'newuser@example.com',
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 100,
            example: 'securePassword123',
          },
          firstName: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            example: 'John',
          },
          lastName: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
            example: 'Doe',
          },
        },
      },

      // Update User DTO
      UpdateUserDto: {
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'updated@example.com',
          },
          password: {
            type: 'string',
            minLength: 8,
            maxLength: 100,
          },
          firstName: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
          },
          lastName: {
            type: 'string',
            minLength: 2,
            maxLength: 50,
          },
          isActive: {
            type: 'boolean',
          },
        },
      },

      // Pagination
      Pagination: {
        type: 'object',
        properties: {
          page: {
            type: 'integer',
            example: 1,
          },
          pageSize: {
            type: 'integer',
            example: 10,
          },
          totalItems: {
            type: 'integer',
            example: 50,
          },
          totalPages: {
            type: 'integer',
            example: 5,
          },
        },
      },
    },
  },
};

const options: swaggerJsdoc.Options = {
  definition: swaggerDefinition,
  // Path to files with API documentation
  apis: ['./src/modules/**/*.routes.ts', './src/app.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

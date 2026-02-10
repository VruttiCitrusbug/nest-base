import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Swagger Configuration
 * 
 * Sets up OpenAPI documentation for the API.
 * Swagger UI will be available at /api/docs
 * 
 * Benefits of Swagger:
 * - Interactive API documentation
 * - API testing without Postman
 * - Client SDK generation
 * - API contract for frontend teams
 * 
 * Authentication in Swagger:
 * The addBearerAuth() setup allows testing protected endpoints.
 * Users can click "Authorize" button, enter JWT token, and test auth routes.
 */
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('NestJS Boilerplate API')
    .setDescription(
      'Production-ready NestJS API with TypeORM, JWT authentication, and role-based access control',
    )
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Health', 'Application health checks')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name must match @ApiBearerAuth('JWT-auth') in controllers
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep auth token after refresh
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });
}

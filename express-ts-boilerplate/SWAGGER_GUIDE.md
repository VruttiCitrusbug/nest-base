# Swagger API Documentation Guide

## Overview

This boilerplate includes comprehensive API documentation using **Swagger/OpenAPI 3.0**. The documentation is automatically generated from JSDoc comments in your route files and provides an interactive API explorer.

## Accessing Documentation

### Interactive Swagger UI
**URL:** http://localhost:3000/api-docs

The Swagger UI provides:
- 📖 Complete API documentation
- 🧪 Interactive API testing ("Try it out" button)
- 📝 Request/response examples
- ✅ Schema validation information
- 🎨 Clean, professional interface

### Raw OpenAPI Spec
**URL:** http://localhost:3000/api-docs.json

Returns the raw OpenAPI specification in JSON format. Useful for:
- Importing into Postman
- Generating client SDKs
- CI/CD validation
- Version control

## Features

### 1. Comprehensive Schemas

All DTOs and response types are fully documented:

- **CreateUserDto** - User creation request
- **UpdateUserDto** - User update request (partial)
- **User** - User response schema
- **Pagination** - Pagination metadata
- **SuccessResponse** - Standard success format
- **ErrorResponse** - Standard error format
- **ValidationErrorResponse** - Validation error details

### 2. Detailed Endpoint Documentation

Each endpoint includes:
- Summary and description
- Request parameters (path, query, body)
- Response codes (200, 201, 400, 404, 409, etc.)
- Request/response examples
- Schema references

### 3. Interactive Testing

Use the "Try it out" button to:
1. Fill in request parameters
2. Execute the request
3. See the actual response
4. Test different scenarios

## Example: Testing User Creation

1. **Open Swagger UI:** http://localhost:3000/api-docs
2. **Navigate to Users section** → Click to expand
3. **Find POST /users** → Click "Try it out"
4. **Fill in the request body:**
   ```json
   {
     "email": "test@example.com",
     "password": "password123",
     "firstName": "Test",
     "lastName": "User"
   }
   ```
5. **Click "Execute"**
6. **See the response** with status code and data

## Adding Documentation to New Routes

When you create new routes, add Swagger documentation using JSDoc comments:

```typescript
/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Creates a new product with validation
 *     tags:
 *       - Products
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *                 example: Product Name
 *               price:
 *                 type: number
 *                 example: 29.99
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 */
router.post('/', validate(CreateProductDto), asyncHandler(controller.create));
```

## Adding New Schemas

To add new schemas, edit `src/config/swagger.ts`:

```typescript
components: {
  schemas: {
    // ... existing schemas
    
    Product: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid',
        },
        name: {
          type: 'string',
          example: 'Product Name',
        },
        price: {
          type: 'number',
          example: 29.99,
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
  },
}
```

## Configuration

### Swagger Config Location
`src/config/swagger.ts`

### Key Configuration Options

```typescript
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Your API Title',
    version: '1.0.0',
    description: 'API Description',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  tags: [
    {
      name: 'Users',
      description: 'User management endpoints',
    },
  ],
};
```

### Customizing Swagger UI

In `src/app.ts`:

```typescript
swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Your API Documentation',
  customfavIcon: '/favicon.ico',
})
```

## Tags and Organization

Use tags to organize endpoints:

```typescript
tags: [
  {
    name: 'Users',
    description: 'User management endpoints',
  },
  {
    name: 'Products',
    description: 'Product management endpoints',
  },
  {
    name: 'Orders',
    description: 'Order management endpoints',
  },
]
```

Then reference them in route documentation:

```typescript
/**
 * @swagger
 * /products:
 *   get:
 *     tags:
 *       - Products
 */
```

## JWT Authentication

JWT Bearer authentication is now configured and ready to use!

### Using Authentication in Swagger UI

1. **Get a JWT Token**: First, you need to obtain a valid JWT token by authenticating with your application
2. **Click "Authorize" button**: Located at the top right of the Swagger UI
3. **Enter your token**: Paste your JWT token in the "Value" field (no "Bearer" prefix needed)
4. **Click "Authorize"**: Your token will be automatically included in all subsequent requests
5. **Test protected routes**: Try endpoints tagged with a lock icon 🔒

### How It's Configured

The `bearerAuth` security scheme is defined in `src/config/swagger.ts`:

```typescript
components: {
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  },
}
```

### Applying to Routes

Protected routes include the `security` property in their Swagger documentation:

```typescript
/**
 * @swagger
 * /protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 */
```

### Role-Based Access Examples

The boilerplate includes three example endpoints demonstrating different authentication levels:

- **`/api/protected`** - Requires any valid JWT token
- **`/api/admin/stats`** - Requires JWT with `admin` role
- **`/api/user/profile`** - Requires JWT with `user` or `admin` role

All these endpoints are documented in the **Authentication** section of Swagger UI.


## Best Practices

### 1. **Keep Documentation Updated**
Update Swagger docs whenever you change routes

### 2. **Use Schema References**
Reuse schemas with `$ref` instead of duplicating

### 3. **Provide Examples**
Include realistic examples in all schemas

### 4. **Document All Response Codes**
Include success and all possible error codes

### 5. **Add Descriptions**
Provide clear, helpful descriptions

### 6. **Group by Tags**
Organize endpoints logically with tags

## Troubleshooting

### Documentation Not Showing

1. **Check file paths in swagger.ts:**
   ```typescript
   apis: [
     './src/modules/**/*.routes.ts',
     './src/app.ts',
   ]
   ```

2. **Ensure JSDoc format is correct**
   - Must start with `/**` not `/*`
   - Must include `@swagger` tag

3. **Check server logs for errors**

### Changes Not Reflecting

The server auto-restarts when files change. If documentation doesn't update:
1. Restart the development server
2. Hard refresh browser (Ctrl+F5)
3. Clear browser cache

## Exporting Documentation

### To Postman
1. Visit http://localhost:3000/api-docs.json
2. Copy the JSON
3. In Postman: Import → Raw Text → Paste JSON

### To File
```bash
curl http://localhost:3000/api-docs.json > openapi.json
```

## Production Considerations

### 1. **Disable in Production (Optional)**
```typescript
if (env.NODE_ENV !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
```

### 2. **Add Authentication**
Protect the /api-docs endpoint if needed

### 3. **Update Server URLs**
Change the production server URL in swagger.ts

## Resources

- [Swagger Documentation](https://swagger.io/docs/)
- [OpenAPI Specification](https://swagger.io/specification/)
- [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)
- [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)

---

**Interactive API documentation is now available at:** http://localhost:3000/api-docs 🎉

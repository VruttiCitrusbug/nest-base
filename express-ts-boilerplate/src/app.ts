import 'reflect-metadata';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { env } from 'config/env';
import logger from 'config/logger';
import { swaggerSpec } from 'config/swagger';
import { errorHandler } from 'middleware/errorHandler';
import { requestLogger } from 'middleware/requestLogger';
import { notFoundHandler } from 'middleware/notFound';

// Import routes
import userRoutes from 'modules/user/user.routes';

// Import authentication middleware
import { jwtBearer, roleRequired } from 'middleware/jwtAuth.middleware';

/**
 * Express Application Setup
 *
 * This file configures the Express application with:
 * - Security middleware (helmet, cors, rate limiting)
 * - Request parsing
 * - Logging
 * - Routes
 * - Error handling
 *
 * Separated from server.ts for better testability
 */

const app: Application = express();

/**
 * Security Middleware
 */
// Helmet helps secure Express apps by setting various HTTP headers
// Modified for Swagger UI
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  })
);

// Enable CORS for all origins (configure based on your needs)
app.use(
  cors({
    origin: '*', // In production, specify allowed origins
    credentials: true,
  })
);

// Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});
app.use('/api/', limiter);

/**
 * Body Parsing Middleware
 */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/**
 * Request Logging
 */
app.use(requestLogger);

/**
 * API Documentation
 * Swagger UI available at /api-docs
 */
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Express TypeScript API Documentation',
  })
);

// Serve Swagger spec as JSON
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

logger.info('📚 Swagger documentation available at /api-docs');

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the health status of the API
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Server is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Server is running
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
  });
});

/**
 * API Routes
 * All API routes are prefixed with /api
 */
app.use('/api/users', userRoutes);

/**
 * Example Protected Routes
 * Demonstrates JWT authentication and role-based access control
 */

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Protected route (requires authentication)
 *     description: Example of a route that requires JWT authentication. Any authenticated user can access this endpoint.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: This is a protected route
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       format: uuid
 *                       example: 550e8400-e29b-41d4-a716-446655440001
 *                     role:
 *                       type: string
 *                       enum: [admin, user]
 *                       example: user
 *       401:
 *         description: Authentication token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Example: Any authenticated user can access
app.get('/api/protected', jwtBearer, (req, res) => {
  res.json({
    success: true,
    message: 'This is a protected route',
    user: req.user, // Token payload with id and role
  });
});

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Admin statistics (admin role required)
 *     description: Example of a route that requires admin role. Only users with 'admin' role can access this endpoint.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Admin statistics
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Insufficient permissions (admin role required)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Example: Only admins can access
app.get('/api/admin/stats', roleRequired('admin'), (req, res) => {
  res.json({
    success: true,
    message: 'Admin statistics',
    user: req.state?.user, // Full User model instance
  });
});

/**
 * @swagger
 * /user/profile:
 *   get:
 *     summary: User profile (user role required)
 *     description: Example of a route that requires user role. Users with 'user' or 'admin' role can access this endpoint (admin inherits user permissions).
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User profile
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Authentication token missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Insufficient permissions (user role required)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Example: Both admins and users can access (any authenticated user)
app.get('/api/user/profile', roleRequired('user'), (req, res) => {
  res.json({
    success: true,
    message: 'User profile',
    user: req.state?.user,
  });
});

/**
 * 404 Handler
 * Must be registered after all routes
 */
app.use(notFoundHandler);

/**
 * Global Error Handler
 * Must be registered last
 */
app.use(errorHandler);

export default app;

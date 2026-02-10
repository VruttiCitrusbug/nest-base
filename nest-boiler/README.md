# NestJS + TypeScript + TypeORM Boilerplate

A production-ready, enterprise-grade NestJS boilerplate with TypeORM, JWT authentication, role-based access control, and comprehensive API documentation.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.development

# Update database credentials in .env.development

# Run database migrations
npm run migration:run

# Seed database with initial data
npm run seed

# Start development server
npm run start:dev

# Visit Swagger documentation
http://localhost:3000/api/docs
```

## ✨ Features

### Core Stack
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe development
- **TypeORM** - Object-Relational Mapping with migrations
- **PostgreSQL** - Production-ready database
- **JWT** - Secure authentication with Passport.js
- **Swagger** - Interactive API documentation

### Architecture & Patterns
- ✅ **Modular Architecture** - Feature-based organization
- ✅ **Dependency Injection** - Loose coupling, high testability
- ✅ **Repository Pattern** - Clean data access layer
- ✅ **DTO Pattern** - Input/output validation and transformation
- ✅ **Global Exception Handling** - Consistent error responses
- ✅ **Response Interceptors** - Standardized API responses
- ✅ **Validation Pipes** - Automatic request validation
- ✅ **Guards & Decorators** - Authentication and authorization

### Security
- 🔒 **JWT Authentication** - Bearer token authentication
- 🔒 **Role-Based Access Control (RBAC)** - Fine-grained permissions
- 🔒 **Password Hashing** - BCrypt encryption
- 🔒 **Helmet** - Security headers
- 🔒 **CORS** - Configurable cross-origin requests
- 🔒 **Rate Limiting** - DDoS protection
- 🔒 **Input Validation** - Class-validator sanitization

### Database
- 💾 **TypeORM Integration** - Type-safe database operations
- 💾 **Migration System** - Version-controlled schema changes
- 💾 **Database Seeders** - Initial data population
- 💾 **Soft Deletes** - Data preservation for auditing
- 💾 **Connection Pooling** - Optimized performance
- 💾 **Transaction Support** - ACID operations

### API Features
- 📡 **CRUD Operations** - Complete Create/Read/Update/Delete
- 📡 **Pagination** - Efficient data retrieval
- 📡 **Filtering & Sorting** - Flexible query options
- 📡 **Swagger Documentation** - Interactive API testing
- 📡 **Standardized Responses** - Consistent JSON structure
- 📡 **Health Checks** - Monitoring endpoints

### Developer Experience
- 🛠️ **Hot Reload** - Fast development iteration
- 🛠️ **Logging** - Request/response tracking
- 🛠️ **Error Messages** - Detailed validation feedback
- 🛠️ **Code Comments** - Educational inline documentation
- 🛠️ **Git-Friendly** - Environment file templates

## 📁 Project Structure

```
nestjs-boilerplate/
├── src/
│   ├── common/                 # Shared utilities
│   │   ├── decorators/        # Custom decorators (@CurrentUser, @Roles, @Public)
│   │   ├── entities/          # Base entity class
│   │   ├── filters/           # Exception filters
│   │   ├── guards/            # Authentication & authorization guards
│   │   ├── interceptors/      # Response transformation
│   │   ├── interfaces/        # TypeScript interfaces
│   │   ├── middleware/        # HTTP logger middleware
│   │   └── pipes/             # Validation pipes
│   ├── config/                # Configuration management
│   │   ├── configuration.ts   # Environment variable loader
│   │   ├── validation.schema.ts # Joi validation schema
│   │   └── swagger.config.ts  # Swagger documentation setup
│   ├── database/              # Database layer
│   │   ├── migrations/        # TypeORM migrations
│   │   ├── seeders/           # Database seeders
│   │   ├── data-source.ts     # TypeORM configuration
│   │   └── database.module.ts # Database module
│   ├── modules/               # Feature modules
│   │   ├── auth/             # Authentication module
│   │   │   ├── dto/          # Login, Register DTOs
│   │   │   ├── strategies/   # JWT strategy
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.module.ts
│   │   ├── users/            # User management module
│   │   │   ├── dto/          # Create, Update, Query, Response DTOs
│   │   │   ├── entities/     # User entity
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   └── users.module.ts
│   │   └── health/           # Health check module
│   │       ├── health.controller.ts
│   │       └── health.module.ts
│   ├── app.module.ts         # Root application module
│   └── main.ts               # Application entry point
├── test/                     # E2E tests
├── .env.example              # Environment template
├── .env.development          # Development environment
├── .env.production           # Production environment
├── package.json
└── README.md
```

## 🔧 Setup Instructions

### Prerequisites
- Node.js >= 18.x
- PostgreSQL >= 13.x
- npm or yarn

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd nestjs-boilerplate
npm install
```

### 2. Environment Configuration

Create environment files:

```bash
cp .env.example .env.development
```

Edit `.env.development` with your settings:

```env
# Application
APP_NAME=nestjs-boilerplate
APP_PORT=3000
APP_ENV=development

# Database
DB_TYPE=postgres
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=nestjs_boilerplate_dev
DB_SYNCHRONIZE=false
DB_LOGGING=true

# JWT (Generate strong secrets!)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRATION=1d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_REFRESH_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Rate Limiting
THROTTLE_TTL=60
THROTTLE_LIMIT=10
```

### 3. Database Setup

Create PostgreSQL database:

```bash
createdb nestjs_boilerplate_dev
```

Run migrations:

```bash
npm run migration:run
```

Seed initial data:

```bash
npm run seed
```

Default seeded users:
- **Admin**: admin@example.com / Admin@123
- **Manager**: manager@example.com / Manager@123
- **User**: john.doe@example.com / User@123

### 4. Run Application

Development mode (with hot reload):

```bash
npm run start:dev
```

Production mode:

```bash
npm run build
npm run start:prod
```

## 🗄️ Database Operations

### Migrations

```bash
# Generate migration from entity changes
npm run migration:generate -- src/database/migrations/MigrationName

# Create empty migration
npm run migration:create -- src/database/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

### Seeders

```bash
# Run all seeders
npm run seed
```

## 📚 API Documentation

### Swagger UI
Visit `http://localhost:3000/api/docs` for interactive API documentation.

### Authentication Flow

1. **Register** new user:
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```

2. **Login** to get JWT token:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecureP@ss123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": "1d",
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

3. **Use token** in subsequent requests:
```http
GET /api/users/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### API Endpoints

#### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

#### Users
- `GET /api/users` - Get all users (paginated, filterable)
- `GET /api/users/me` - Get current user profile
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

#### Health
- `GET /health` - Overall health check
- `GET /health/db` - Database health
- `GET /health/memory` - Memory usage

### Query Parameters

Get users with pagination and filtering:

```http
GET /api/users?page=1&limit=10&role=user&search=john&sortBy=createdAt&sortOrder=DESC
```

## 🧪 Testing

### Unit Tests

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:cov
```

### E2E Tests

```bash
npm run test:e2e
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables

Set production environment variables:
- Use strong JWT secrets (min 32 characters)
- Set `DB_SYNCHRONIZE=false` (always!)
- Configure proper CORS origins
- Set appropriate rate limits

### Docker (Optional)

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["node", "dist/main"]
```

## 🎓 NestJS Concepts Explained

### What is Dependency Injection?

Instead of creating dependencies manually:

```typescript
// ❌ Manual (tightly coupled)
class UsersController {
  private usersService = new UsersService();
}
```

NestJS injects them:

```typescript
// ✅ Dependency Injection (loosely coupled, testable)
class UsersController {
  constructor(private usersService: UsersService) {}
}
```

### Guards vs Middleware vs Interceptors

**Request Lifecycle:**
1. **Middleware** - Request parsing, logging
2. **Guards** - Authentication, authorization
3. **Interceptors (before)** - Can modify request
4. **Pipes** - Validation, transformation
5. **Route Handler** - Your controller method
6. **Interceptors (after)** - Response transformation
7. **Exception Filters** - Error handling

**When to use what:**
- **Middleware**: CORS, body parsing, request logging
- **Guards**: Authentication (who are you?), Authorization (are you allowed?)
- **Interceptors**: Response formatting, caching, timeouts
- **Pipes**: Input validation, type transformation

### Modules

Modules organize related functionality:

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Available to other modules
})
export class UsersModule {}
```

## 📖 Additional Documentation

- [Migration from Express to NestJS](./docs/MIGRATION_FROM_EXPRESS.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is [MIT licensed](LICENSE).

## 🙏 Acknowledgments

Built with the same quality standards as the Express-TS boilerplate, adapted for NestJS's powerful architecture and conventions.

---

**Happy coding! 🚀**

# Express + TypeScript + Sequelize Boilerplate

A production-ready, enterprise-grade Node.js boilerplate with Express.js, TypeScript, and Sequelize ORM. This boilerplate mirrors the architectural quality of FastAPI projects with comprehensive validation, error handling, and best practices.

## 🎯 Features

- ✅ **TypeScript** - Full type safety with strict mode
- ✅ **Express.js** - Fast, minimalist web framework
- ✅ **Sequelize ORM** - PostgreSQL/MySQL/SQLite support
- ✅ **Class-based OOP** - Clean, maintainable architecture
- ✅ **Validation** - class-validator (Pydantic equivalent)
- ✅ **Global Error Handling** - Consistent error responses
- ✅ **Request/Response Formatting** - Standardized API responses
- ✅ **Database Migrations** - Version-controlled schema changes
- ✅ **Database Seeders** - Consistent test data
- ✅ **Logging** - Winston logger with file rotation
- ✅ **Security** - Helmet, CORS, rate limiting
- ✅ **Code Quality** - ESLint + Prettier ready

## 📁 Project Structure

```
express-ts-boilerplate/
├── src/
│   ├── config/                  # Configuration files
│   │   ├── database.ts          # Sequelize configuration
│   │   ├── env.ts               # Environment variables (validated)
│   │   └── logger.ts            # Winston logger setup
│   │
│   ├── database/
│   │   ├── models/              # Sequelize models
│   │   │   ├── index.ts         # Models registry
│   │   │   └── BaseModel.ts     # Base model with common fields
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/             # Database seeders
│   │
│   ├── modules/                 # Feature modules (domain-driven)
│   │   └── user/                # Example: User module
│   │       ├── user.model.ts    # Sequelize model
│   │       ├── user.dto.ts      # DTOs with validation
│   │       ├── user.repository.ts # Data access layer
│   │       ├── user.service.ts  # Business logic layer
│   │       ├── user.controller.ts # Request handling
│   │       └── user.routes.ts   # Route definitions
│   │
│   ├── common/                  # Shared utilities
│   │   ├── errors/              # Custom error classes
│   │   │   ├── AppError.ts
│   │   │   ├── ValidationError.ts
│   │   │   ├── NotFoundError.ts
│   │   │   └── DatabaseError.ts
│   │   └── utils/
│   │       ├── response.ts      # Response formatters
│   │       └── asyncHandler.ts  # Async error wrapper
│   │
│   ├── middleware/              # Express middleware
│   │   ├── errorHandler.ts      # Global error handler
│   │   ├── validation.ts        # Validation middleware
│   │   ├── requestLogger.ts     # Request logging
│   │   └── notFound.ts          # 404 handler
│   │
│   ├── app.ts                   # Express app configuration
│   └── server.ts                # Server entry point
│
├── .env.example                 # Environment variables template
├── .sequelizerc                 # Sequelize CLI config
├── tsconfig.json                # TypeScript config
└── package.json                 # Dependencies and scripts
```

## 🏗️ Architecture

This boilerplate follows a **layered architecture** pattern:

### 1. **Controller Layer** (`*.controller.ts`)
- Handles HTTP requests and responses
- Extracts data from requests
- Calls service layer methods
- Formats responses

### 2. **Service Layer** (`*.service.ts`)
- Contains business logic
- Validates business rules
- Orchestrates multiple repository calls
- Independent of HTTP concerns

### 3. **Repository Layer** (`*.repository.ts`)
- Handles database operations
- Encapsulates data access logic
- No business logic
- Makes code testable and swappable

### 4. **Model Layer** (`*.model.ts`)
- Defines database schema
- Sequelize models with decorators
- Extends BaseModel for common fields

### 5. **DTO Layer** (`*.dto.ts`)
- Request/response validation
- Uses class-validator decorators
- Type-safe data transfer objects

```
┌─────────────────────────────────────────────────┐
│                   HTTP Request                  │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│            Validation Middleware                │
│         (validates against DTOs)                │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│                Controller                       │
│        (extracts data, calls service)          │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│                Service                          │
│        (business logic & validation)           │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│               Repository                        │
│         (database operations)                  │
└──────────────────┬──────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────┐
│                Database                         │
└─────────────────────────────────────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (or MySQL/SQLite)
- npm or yarn

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd express-ts-boilerplate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```env
   NODE_ENV=development
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=express_ts_dev
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DIALECT=postgres
   ```

4. **Create database:**
   ```bash
   npm run db:create
   ```

5. **Run migrations:**
   ```bash
   npm run migrate
   ```

6. **Seed database (optional):**
   ```bash
   npm run seed
   ```

7. **Start development server:**
   ```bash
   npm run dev
   ```

The server will start on http://localhost:3000

## 📝 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run migrate` | Run database migrations |
| `npm run migrate:undo` | Revert last migration |
| `npm run seed` | Run database seeders |
| `npm run seed:undo` | Revert all seeders |
| `npm run db:create` | Create database |
| `npm run db:drop` | Drop database |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## 🔌 API Endpoints

### Users

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/api/users` | Create user | `CreateUserDto` |
| GET | `/api/users` | Get all users (paginated) | Query: `page`, `pageSize`, `search` |
| GET | `/api/users/:id` | Get user by ID | - |
| PUT | `/api/users/:id` | Update user | `UpdateUserDto` |
| DELETE | `/api/users/:id` | Delete user | - |

### Example Requests

**Create User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

**Get All Users (with pagination):**
```bash
curl http://localhost:3000/api/users?page=1&pageSize=10
```

**Get User by ID:**
```bash
curl http://localhost:3000/api/users/{user-id}
```

## 📤 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "timestamp": "2026-01-21T12:30:00.000Z"
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "constraints": ["Invalid email format"],
        "value": "invalid-email"
      }
    ]
  },
  "timestamp": "2026-01-21T12:30:00.000Z"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "totalItems": 50,
      "totalPages": 5
    }
  },
  "message": "Success",
  "timestamp": "2026-01-21T12:30:00.000Z"
}
```

## ✅ Validation

This boilerplate uses **class-validator** (TypeScript equivalent of Pydantic) for automatic validation:

```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;
}
```

Validation happens automatically in the middleware:
```typescript
router.post('/', validate(CreateUserDto), controller.create);
```

## 🔧 Database Migrations

### Create a New Migration
```bash
npx sequelize-cli migration:generate --name add-phone-to-users
```

### Migration Example
```javascript
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'phone');
  },
};
```

### Run Migrations
```bash
npm run migrate
```

## 🌱 Database Seeders

### Create a New Seeder
```bash
npx sequelize-cli seed:generate --name demo-users
```

### Run Seeders
```bash
npm run seed
```

## 🛠️ Creating a New Module

Follow this pattern to create new modules:

1. **Create module directory:**
   ```
   src/modules/product/
   ```

2. **Create model:**
   ```typescript
   // product.model.ts
   @Table({ tableName: 'products' })
   export class Product extends BaseModel {
     @Column({ type: DataType.STRING })
     name!: string;
   }
   ```

3. **Create DTOs:**
   ```typescript
   // product.dto.ts
   export class CreateProductDto {
     @IsString()
     name!: string;
   }
   ```

4. **Create repository:**
   ```typescript
   // product.repository.ts
   export class ProductRepository {
     async create(data: CreateProductDto) { ... }
   }
   ```

5. **Create service:**
   ```typescript
   // product.service.ts
   export class ProductService {
     async createProduct(data: CreateProductDto) { ... }
   }
   ```

6. **Create controller:**
   ```typescript
   // product.controller.ts
   export class ProductController {
     createProduct = async (req, res) => { ... }
   }
   ```

7. **Create routes:**
   ```typescript
   // product.routes.ts
   router.post('/', validate(CreateProductDto), controller.create);
   ```

8. **Register in app.ts:**
   ```typescript
   import productRoutes from './modules/product/product.routes';
   app.use('/api/products', productRoutes);
   ```

## 🔒 Error Handling

Custom error classes for different scenarios:

```typescript
// Custom errors
throw new NotFoundError('User', userId);
throw new ValidationError('Invalid data', errors);
throw new AppError('Custom error message', 400);
throw new DatabaseError('Query failed', originalError);
```

All errors are caught by the global error handler and formatted consistently.

## 📊 Logging

Winston logger with multiple transports:

```typescript
import logger from '@config/logger';

logger.info('Information message');
logger.warn('Warning message');
logger.error('Error message', { metadata });
logger.debug('Debug message');
```

Logs are stored in:
- `logs/combined.log` - All logs
- `logs/error.log` - Error logs only

## 🔐 Security Features

- **Helmet** - Sets secure HTTP headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevents abuse (100 req/15min)
- **Input Validation** - Prevents invalid data
- **SQL Injection Protection** - Sequelize parameterized queries

## 🎨 Code Style

- **ESLint** - Linting rules
- **Prettier** - Code formatting
- **TypeScript** - Strict type checking

## 📚 Key Concepts

### 1. **Dependency Injection**
Services and repositories are instantiated in constructors, making them easy to test and mock.

### 2. **Separation of Concerns**
Each layer has a single responsibility:
- Controllers handle HTTP
- Services handle business logic
- Repositories handle data

### 3. **Type Safety**
TypeScript ensures type safety across the entire application.

### 4. **Async Error Handling**
`asyncHandler` wrapper eliminates try-catch blocks in controllers.

### 5. **Soft Deletes**
BaseModel enables soft deletes (paranoid mode) by default.

## 🚀 Production Deployment

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Set production environment:**
   ```env
   NODE_ENV=production
   ```

3. **Run migrations:**
   ```bash
   npm run migrate
   ```

4. **Start server:**
   ```bash
   npm start
   ```

## 🧪 Testing (TODO)

Add your testing framework (Jest, Mocha, etc.):

```bash
npm install --save-dev jest @types/jest ts-jest
```

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Sequelize Documentation](https://sequelize.org/)
- [class-validator](https://github.com/typestack/class-validator)

## 🤝 Contributing

This is a boilerplate template. Feel free to modify and extend it for your specific needs.

## 📄 License

MIT

---

**Built with ❤️ for production-ready Node.js applications**

# Migration Guide: Express + Sequelize → NestJS + TypeORM

This guide helps you understand the key differences between your existing Express-TS boilerplate and this NestJS boilerplate, making it easy to transition between the two approaches.

## Table of Contents
1. [Core Philosophy](#core-philosophy)
2. [Project Structure](#project-structure)
3. [Dependency Injection](#dependency-injection)
4. [Routing](#routing)
5. [Middleware vs Guards vs Interceptors](#middleware-vs-guards-vs-interceptors)
6. [ORM Differences](#orm-differences)
7. [Validation](#validation)
8. [Error Handling](#error-handling)
9. [Authentication](#authentication)
10. [Testing](#testing)

---

## Core Philosophy

### Express Approach
- **Minimalist**: Provides core HTTP server functionality
- **Manual wiring**: You connect components manually
- **Middleware-based**: Everything is middleware
- **Flexible**: Choose your own structure

### NestJS Approach
- **Opinionated**: Enforces architectural patterns
- **Automatic wiring**: Dependency injection handles connections
- **Component-based**: Decorators define behavior
- **Structured**: Module-based architecture

---

## Project Structure

### Express Structure
```
express-ts-boilerplate/
├── src/
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   ├── models/
│   ├── middleware/
│   └── app.ts
```

### NestJS Structure
```
nestjs-boilerplate/
├── src/
│   ├── modules/          # Feature modules
│   │   └── users/
│   │       ├── users.controller.ts
│   │       ├── users.service.ts
│   │       ├── users.module.ts
│   │       ├── entities/
│   │       └── dto/
│   ├── common/           # Shared utilities
│   ├── config/
│   └── main.ts
```

**Key Difference**: NestJS groups related files by feature (vertical slicing), while Express typically groups by type (horizontal slicing).

---

## Dependency Injection

### Express (Manual Dependencies)
```typescript
// services/user.service.ts
import { User } from '../models/User';

class UserService {
  async findById(id: string) {
    return await User.findByPk(id);
  }
}

export default new UserService();

// controllers/user.controller.ts
import userService from '../services/user.service';

class UserController {
  async getUser(req, res) {
    const user = await userService.findById(req.params.id);
    res.json(user);
  }
}
```

### NestJS (Dependency Injection)
```typescript
// users.service.ts
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }
}

// users.controller.ts
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return await this.usersService.findById(id);
  }
}
```

**Benefits**:
- Easier testing (mock dependencies)
- Looser coupling
- Automatic singleton management
- Clear dependency graph

---

## Routing

### Express
```typescript
// routes/user.routes.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const userController = new UserController();

router.get('/users', authenticate, userController.getUsers);
router.get('/users/:id', authenticate, userController.getUser);
router.post('/users', authenticate, userController.createUser);

export default router;

// app.ts
import userRoutes from './routes/user.routes';
app.use('/api', userRoutes);
```

### NestJS
```typescript
// users.controller.ts
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() { ... }

  @Get(':id')
  async getUser(@Param('id') id: string) { ... }

  @Post()
  async createUser(@Body() dto: CreateUserDto) { ... }
}

// users.module.ts
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
```

**Key Differences**:
- Decorators vs Router methods
- Automatic route registration
- Type-safe parameters
- Clear method signatures

---

## Middleware vs Guards vs Interceptors

### Express: Everything is Middleware
```typescript
// Authentication middleware
app.use(authenticate);

// Logging middleware
app.use(logger);

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});
```

### NestJS: Specialized Components

```typescript
// Middleware (low-level, request/response processing)
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req, res, next) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}

// Guard (authentication/authorization decisions)
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}

// Interceptor (transform response, timing, caching)
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context, next) {
    return next.handle().pipe(
      map(data => ({ success: true, data }))
    );
  }
}

// Exception Filter (error handling)
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host) {
    // Format error response
  }
}
```

**When to use what**:
- **Middleware**: Body parsing, CORS, logging
- **Guards**: Authentication, authorization
- **Interceptors**: Response transformation, caching
- **Pipes**: Input validation, transformation
- **Filters**: Error handling

---

## ORM Differences: Sequelize vs TypeORM

### Sequelize (Express)
```typescript
// models/User.ts
import { Model, DataTypes } from 'sequelize';

class User extends Model {
  id!: string;
  email!: string;
}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
}, { sequelize });

// Usage
const user = await User.findByPk(id);
const users = await User.findAll({ where: { role: 'admin' } });
```

### TypeORM ( NestJS)
```typescript
// entities/user.entity.ts
@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;
}

// Usage (in service with repository)
const user = await this.userRepository.findOne({ where: { id } });
const users = await this.userRepository.find({ where: { role: 'admin' } });
```

**Key Differences**:
- **TypeORM**: Decorator-based, more TypeScript-native
- **Sequelize**: Method-based, similar to ActiveRecord
- **Migrations**: Both support migrations, TypeORM generates from entities
- **Relations**: TypeORM uses decorators (@OneToMany, @ManyToOne)

---

## Validation

### Express (Manual or express-validator)
```typescript
// With express-validator
import { body, validationResult } from 'express-validator';

app.post('/users',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // Process request
  }
);
```

### NestJS (class-validator + DTOs)
```typescript
// create-user.dto.ts
export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

// controller
@Post()
async create(@Body() dto: CreateUserDto) {
  // Validation happens automatically!
  // If validation fails, BadRequestException is thrown
  return this.usersService.create(dto);
}
```

**Benefits of NestJS approach**:
- Automatic validation
- Reusable DTOs
- Type safety
- Clear documentation
- Swagger auto-generation

---

## Error Handling

### Express
```typescript
// Error middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

// In controller
try {
  const user = await userService.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
} catch (error) {
  res.status(404).json({ error: error.message });
}
```

### NestJS
```typescript
// Global exception filter
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception, host) {
    // Centralized error formatting
  }
}

// In service
async findById(id: string) {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException('User not found'); // Auto-converted to 404
  }
  return user;
}
```

**NestJS Benefits**:
- Built-in HTTP exceptions
- Global error handling
- Consistent error format
- Better stack traces

---

## Authentication

### Express (JWT with Passport)
```typescript
// middleware/auth.ts
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';

passport.use(new JwtStrategy(options, async (payload, done) => {
  const user = await User.findByPk(payload.sub);
  return done(null, user);
}));

// Apply to routes
app.get('/protected', passport.authenticate('jwt'), (req, res) => {
  res.json({ user: req.user });
});
```

### NestJS (JWT with Passport)
```typescript
// jwt.strategy.ts
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private usersService: UsersService) {
    super({ ... });
  }

  async validate(payload) {
    return this.usersService.findById(payload.sub);
  }
}

// Apply to routes
@Get('protected')
@UseGuards(JwtAuthGuard)
getProtected(@CurrentUser() user: User) {
  return { user};
}
```

**NestJS Benefits**:
- Type-safe user extraction with @CurrentUser()
- Declarative guards
- Easy to combine with other guards (e.g., @Roles())
- Better testability

---

## Testing

### Express
```typescript
import request from 'supertest';
import app from '../app';

describe('GET /users', () => {
  it('should return users', async () => {
    const res = await request(app)
      .get('/api/users')
      .expect(200);
    
    expect(res.body).toHaveLength(10);
  });
});
```

### NestJS
```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));
  });

  it('should find user by id', async () => {
    jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
    const user = await service.findById('123');
    expect(user).toEqual(mockUser);
  });
});
```

**NestJS Benefits**:
- Built-in testing utilities
- Easy dependency mocking
- Module-based test setup
- Better isolation

---

## Summary

| Aspect | Express | NestJS |
|--------|---------|--------|
| **Architecture** | Flexible, manual | Modular, structured |
| **Dependencies** | Manual imports | Dependency injection |
| **Routing** | Express Router | Decorators |
| **Validation** | Manual/Libraries | Built-in with DTOs |
| **ORM** | Sequelize | TypeORM |
| **Error Handling** | Middleware | Exception filters |
| **Testing** | Standard Jest | Built-in testing module |
| **Learning Curve** | Lower | Higher initially |
| **Scalability** | Manual organization | Built-in patterns |
| **TypeScript** | Good support | Native, first-class |

## When toUse What?

**Use Express when**:
- You want maximum flexibility
- Building a simple API
- You prefer minimal abstractions
- Team is familiar with Express

**Use NestJS when**:
- Building enterprise applications
- Want enforced best practices
- Need built-in patterns (DI, modules)
- Prefer opinionated structure
- Team can invest in learning curve

---

## Next Steps

1. Explore the NestJS boilerplate code
2. Try creating a new module following existing patterns
3. Read the inline comments explaining NestJS concepts
4. Compare equivalent features between your Express and NestJS boilerplates
5. Choose the approach that fits your project needs

Both are excellent choices with different philosophies!

import { Request, Response } from 'express';
import { UserService } from 'modules/user/user.service';
import { CreateUserDto, UpdateUserDto, UserQueryDto } from 'modules/user/user.dto';
import { successResponse, paginatedResponse } from 'common/utils/response';

/**
 * User Controller
 *
 * Handles HTTP requests and responses
 * This layer is thin - it just:
 * 1. Extracts data from request
 * 2. Calls appropriate service method
 * 3. Formats and sends response
 *
 * All business logic is in the service layer
 * All data access is in the repository layer
 */
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * Create a new user
   * POST /api/users
   */
  createUser = async (req: Request, res: Response): Promise<Response> => {
    const dto = req.body as CreateUserDto;
    const user = await this.userService.createUser(dto);

    return successResponse(res, user, 'User created successfully', 201);
  };

  /**
   * Get all users with pagination
   * GET /api/users?page=1&pageSize=10&search=john
   */
  getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    const { page, pageSize, search } = req.query as unknown as UserQueryDto;

    const pageNum = parseInt(page || '1', 10);
    const pageSizeNum = parseInt(pageSize || '10', 10);

    const result = await this.userService.getAllUsers(pageNum, pageSizeNum, search);

    return paginatedResponse(
      res,
      result.users,
      {
        page: result.page,
        pageSize: result.pageSize,
        totalItems: result.total,
        totalPages: Math.ceil(result.total / result.pageSize),
      },
      'Users retrieved successfully'
    );
  };

  /**
   * Get user by ID
   * GET /api/users/:id
   */
  getUserById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);

    return successResponse(res, user, 'User retrieved successfully');
  };

  /**
   * Update user
   * PUT /api/users/:id
   */
  updateUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const dto = req.body as UpdateUserDto;

    const user = await this.userService.updateUser(id, dto);

    return successResponse(res, user, 'User updated successfully');
  };

  /**
   * Delete user
   * DELETE /api/users/:id
   */
  deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    await this.userService.deleteUser(id);

    return successResponse(res, null, 'User deleted successfully', 204);
  };
}

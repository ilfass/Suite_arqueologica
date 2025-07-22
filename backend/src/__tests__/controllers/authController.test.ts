import { Request, Response } from 'express';
import { authController } from '../../controllers/authController';
import { AuthService } from '../../services/authService';
import { UserRole } from '../../types/user';

// Mock de AuthService
jest.mock('../../services/authService');

describe('AuthController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        role: UserRole.RESEARCHER,
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
        fullName: 'Test User',
        role: UserRole.RESEARCHER,
      };

      (AuthService.register as jest.Mock).mockResolvedValue(mockUser);

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: mockUser,
        },
      });
    });

    it('should call next with error if required fields are missing', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        // Missing password and fullName
      };

      await authController.register(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login a user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        role: UserRole.RESEARCHER,
      };

      mockRequest.body = {
        email: 'test@example.com',
        password: 'password123',
      };

      (AuthService.login as jest.Mock).mockResolvedValue({
        user: mockUser,
        token: 'token123',
      });

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        status: 'success',
        data: {
          user: mockUser,
          token: 'token123',
        },
      });
    });

    it('should call next with error if email or password is missing', async () => {
      mockRequest.body = {
        email: 'test@example.com',
        // Missing password
      };

      await authController.login(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
}); 
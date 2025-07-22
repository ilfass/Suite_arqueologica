import { AuthService } from '../../services/authService';
import { UserRole } from '../../types/user';
import supabase from '../../config/supabase';

// Mock de Supabase
jest.mock('../../config/supabase', () => ({
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    signOut: jest.fn(),
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    single: jest.fn(),
    eq: jest.fn().mockReturnThis(),
  })),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        role: UserRole.RESEARCHER,
      };

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      (supabase.from('users').insert as jest.Mock).mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await AuthService.register(
        'test@example.com',
        'password123',
        'Test User',
        UserRole.RESEARCHER
      );

      expect(result).toEqual(mockUser);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should throw an error if registration fails', async () => {
      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Registration failed' },
      });

      await expect(
        AuthService.register('test@example.com', 'password123', 'Test User', UserRole.RESEARCHER)
      ).rejects.toThrow('Registration failed');
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

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: {
          user: { id: '123' },
          session: { access_token: 'token123' },
        },
        error: null,
      });

      (supabase.from('users').select as jest.Mock).mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await AuthService.login('test@example.com', 'password123');

      expect(result).toEqual({
        user: mockUser,
        token: 'token123',
      });
    });

    it('should throw an error if login fails', async () => {
      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Invalid credentials' },
      });

      await expect(AuthService.login('test@example.com', 'password123')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: null,
      });

      await expect(AuthService.logout()).resolves.not.toThrow();
    });

    it('should throw an error if logout fails', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({
        error: { message: 'Logout failed' },
      });

      await expect(AuthService.logout()).rejects.toThrow('Logout failed');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        fullName: 'Test User',
        role: UserRole.RESEARCHER,
      };

      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: { id: '123' } },
        error: null,
      });

      (supabase.from('users').select as jest.Mock).mockResolvedValue({
        data: mockUser,
        error: null,
      });

      const result = await AuthService.getCurrentUser('test-user-id');

      expect(result).toEqual(mockUser);
    });

    it('should throw an error if getting current user fails', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Not authenticated' },
      });

      await expect(AuthService.getCurrentUser('test-user-id')).rejects.toThrow('Not authenticated');
    });
  });
}); 
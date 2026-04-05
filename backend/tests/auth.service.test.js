/**
 * tests/auth.service.test.js
 * Unit tests for auth.service.js
 */

// Mock dependencies before imports
jest.mock('../src/models/User');
jest.mock('../src/utils/jwt');

const authService = require('../src/services/auth.service');
const User = require('../src/models/User');
const { signToken } = require('../src/utils/jwt');

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── registerUser ──────────────────────────────────────────────────────────
  describe('registerUser', () => {
    it('should register a new user and return token', async () => {
      // Arrange
      User.emailExists = jest.fn().mockResolvedValue(false);
      const mockUser = {
        _id: 'user123',
        name: 'Test User',
        email: 'test@example.com',
        role: 'VIEWER',
        status: 'ACTIVE',
        toObject: jest.fn().mockReturnValue({
          _id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'VIEWER',
        }),
      };
      User.create = jest.fn().mockResolvedValue(mockUser);
      signToken.mockReturnValue('mock-jwt-token');

      // Act
      const result = await authService.registerUser({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'VIEWER',
      });

      // Assert
      expect(User.emailExists).toHaveBeenCalledWith('test@example.com');
      expect(User.create).toHaveBeenCalledTimes(1);
      expect(signToken).toHaveBeenCalledWith({ userId: 'user123', role: 'VIEWER' });
      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@example.com');
      expect(result.user.password).toBeUndefined(); // Password must be stripped
    });

    it('should throw 409 if email already exists', async () => {
      // Arrange
      User.emailExists = jest.fn().mockResolvedValue(true);

      // Act + Assert
      await expect(
        authService.registerUser({
          name: 'Dup User',
          email: 'dup@example.com',
          password: 'pass123',
        })
      ).rejects.toMatchObject({ statusCode: 409, message: expect.stringContaining('already') });

      expect(User.create).not.toHaveBeenCalled();
    });
  });

  // ─── loginUser ─────────────────────────────────────────────────────────────
  describe('loginUser', () => {
    it('should login a valid user and return token', async () => {
      // Arrange
      const mockUser = {
        _id: 'user456',
        email: 'login@example.com',
        role: 'ANALYST',
        status: 'ACTIVE',
        comparePassword: jest.fn().mockResolvedValue(true),
        toObject: jest.fn().mockReturnValue({
          _id: 'user456',
          email: 'login@example.com',
          role: 'ANALYST',
        }),
      };
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });
      signToken.mockReturnValue('login-jwt-token');

      // Act
      const result = await authService.loginUser({
        email: 'login@example.com',
        password: 'correctpass',
      });

      // Assert
      expect(mockUser.comparePassword).toHaveBeenCalledWith('correctpass');
      expect(result.token).toBe('login-jwt-token');
    });

    it('should throw 401 if user not found', async () => {
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(null),
      });

      await expect(
        authService.loginUser({ email: 'nobody@example.com', password: 'pass' })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw 401 if password is incorrect', async () => {
      const mockUser = {
        status: 'ACTIVE',
        comparePassword: jest.fn().mockResolvedValue(false),
      };
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(
        authService.loginUser({ email: 'test@example.com', password: 'wrongpass' })
      ).rejects.toMatchObject({ statusCode: 401 });
    });

    it('should throw 403 if user is INACTIVE', async () => {
      const mockUser = {
        status: 'INACTIVE',
        comparePassword: jest.fn(),
      };
      User.findOne = jest.fn().mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(
        authService.loginUser({ email: 'inactive@example.com', password: 'pass' })
      ).rejects.toMatchObject({ statusCode: 403 });
    });
  });
});

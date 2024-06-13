import { describe, beforeAll, test, expect, jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { authService, tokenService } from '../../src/services';
import userService from '../../src/services/user.service';
import { admin } from '../fixtures/user.fixture';
import ApiError from '../../src/utils/ApiError';
import httpStatus from 'http-status';

import prisma from '../../src/client';

jest.mock('../../src/client', () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    token: {
      findFirst: jest.fn(),
      delete: jest.fn()
    }
  }
}));

jest.mock('../../src/utils/encryption');

jest.mock('../../src/config/config', () => ({
  env: 'test',
  port: 3000,
  jwt: {
    secret: 'your_mocked_jwt_secret',
    accessExpirationMinutes: 30,
    refreshExpirationDays: 30,
    resetPasswordExpirationMinutes: 10,
    verifyEmailExpirationMinutes: 10
  },
  email: {
    smtp: {
      host: 'smtp.example.com',
      port: 25,
      auth: {
        user: 'username',
        pass: 'password'
      }
    },
    from: 'noreply@example.com'
  },
  orion: {
    url: 'https://orion.example.com',
    apiKey: 'your_mocked_orion_api_key'
  }
}));

import { Token, TokenType, User, UserType } from '@prisma/client';

describe('Auth service module', () => {
  const sampleUser: User = {
    id: 1,
    email: 'existing@example.com',
    name: 'John Doe',
    userType: 'USER',
    userData: {},
    clientID: null,
    password: 'hashedPassword'
  } as User;

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('create a new user', async () => {
    jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);
    const n = {
      id: 1,
      email: faker.internet.email(),
      password: faker.internet.password(),
      name: faker.name.fullName(),
      userType: UserType.USER
    } as User;
    jest.spyOn(prisma.user, 'create').mockResolvedValueOnce(n);
    const newUser = await userService.createUser(n.email, n.password, n.name);

    expect(newUser.userType).toBe('USER');
    expect(newUser.name).toBe(n.name);
  });

  test('create a admin', async () => {
    jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);

    jest.spyOn(prisma.user, 'create').mockResolvedValueOnce({ ...sampleUser, userType: 'ADMIN' });
    const newUser = await userService.createUser(
      admin.email,
      admin.password,
      admin.name,
      {},
      admin.userType
    );
    expect(newUser).toBeTruthy();
    expect(newUser.userType).toBe('ADMIN');
  });

  describe('Logging in using email and password', () => {
    test('should throw an error if email is already taken', async () => {
      const mockUserData = {
        id: 1,
        email: 'existing@example.com',
        name: 'John Doe',
        password: 'hashedPassword',
        userType: 'USER'
      };

      const mockGetUserByEmail: any = jest.fn().mockReturnValue({
        id: mockUserData.id,
        email: mockUserData.email,
        name: mockUserData.name,
        password: mockUserData.password,
        userType: mockUserData.userType
      });

      jest.spyOn(userService, 'getUserByEmail').mockImplementation(mockGetUserByEmail);

      await expect(
        userService.createUser('existing@example.com', 'password', 'John Doe')
      ).rejects.toThrow(new ApiError(httpStatus.BAD_REQUEST, 'Email already taken'));
    });

    test('should return a user if the email and password are correct', async () => {
      // prismaMock.user.create.mockResolvedValueOnce(sampleUser);
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(sampleUser);
      jest.spyOn(authService, 'isPasswordMatch').mockResolvedValueOnce(true);

      const user = await authService.loginUserWithEmailAndPassword(
        sampleUser.email,
        sampleUser.password
      );
      expect(user).toBeTruthy();
      expect(user.userType).toBe('USER');
      expect(user).toEqual({
        id: sampleUser.id,
        email: sampleUser.email,
        name: sampleUser.name,
        userType: sampleUser.userType,
        userData: sampleUser.userData
      });
    });

    test('should return an error if email is not found', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);
      await expect(
        authService.loginUserWithEmailAndPassword('existing@example.com', 'password')
      ).rejects.toThrow(new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password'));
    });

    test('should return an error if password is not correct', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(sampleUser);
      jest.spyOn(authService, 'isPasswordMatch').mockResolvedValueOnce(false);
      await expect(
        authService.loginUserWithEmailAndPassword(sampleUser.email, 'wrongPassword')
      ).rejects.toThrow(new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password'));
    });
  });

  describe('Logout module', () => {
    test('should return error for not providing refresh token', async () => {
      jest.spyOn(prisma.token, 'findFirst').mockResolvedValueOnce(null);

      await expect(authService.logout('xxx')).rejects.toThrow(
        new ApiError(httpStatus.NOT_FOUND, 'Not found')
      );
    });

    test('should logout successfully', async () => {
      const mockToken1: Token = {
        id: 1,
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
        type: TokenType.REFRESH,
        expires: new Date('2023-07-01T00:00:00Z'),
        blacklisted: false,
        userId: 1,
        createdAt: new Date('2023-06-01T12:00:00Z')
      };
      jest.spyOn(prisma.token, 'findFirst').mockResolvedValueOnce(mockToken1);

      jest.spyOn(prisma.token, 'delete').mockResolvedValueOnce(mockToken1);

      await authService.logout(mockToken1.token);
      expect(prisma.token.delete).toHaveBeenCalledWith({
        where: {
          id: mockToken1.id
        }
      });
    });
  });

  describe('Refresh token module', () => {
    const sampleToken = 'token';
    const mockToken1: Token = {
      id: 1,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      type: TokenType.REFRESH,
      expires: new Date('2023-07-01T00:00:00Z'),
      blacklisted: false,
      userId: 1,
      createdAt: new Date('2023-06-01T12:00:00Z')
    };
    const mockToken2: Token = {
      id: 2,
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
      type: TokenType.REFRESH,
      expires: new Date('2023-06-30T23:59:59Z'),
      blacklisted: false,
      userId: 2,
      createdAt: new Date('2023-06-15T09:00:00Z')
    };

    test('should throw an error if the token is not present', async () => {
      jest.spyOn(tokenService, 'verifyToken').mockImplementation(() => {
        throw new Error('Error');
      });
      expect(authService.refreshAuth(sampleToken)).rejects.toEqual(
        new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate')
      );
    });

    test('should return new set of tokens after refreshing', async () => {
      jest.spyOn(tokenService, 'verifyToken').mockResolvedValueOnce(mockToken1);
      jest.spyOn(prisma.token, 'delete').mockResolvedValueOnce(mockToken1);
      jest.spyOn(tokenService, 'generateAuthTokens').mockResolvedValueOnce({
        access: {
          token: mockToken1.token,
          expires: new Date()
        },
        refresh: {
          token: mockToken2.token,
          expires: mockToken2.expires
        }
      });

      const res = await authService.refreshAuth(mockToken1.token);

      expect(prisma.token.delete).toHaveBeenCalled();
      expect(res.access).toHaveProperty('token');
      expect(res.refresh).toHaveProperty('token');
    });
  });
});

import { describe, beforeAll, test, expect, jest } from '@jest/globals';
import { faker } from '@faker-js/faker';
import { authService } from '../../src/services';
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

import { User, UserType } from '@prisma/client';

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
  beforeAll(async () => {});

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
  });
});

import { describe, beforeEach, test, expect, jest } from '@jest/globals';

import { userService } from '../../src/services';

import prisma from '../../src/client';
import { User, Prisma, Enrollment } from '@prisma/client';
import httpStatus from 'http-status';
import ApiError from '../../src/utils/ApiError';
import { mockOrionResponse } from '../fixtures/orion.fixture';
import * as orionRequest from '../../src/utils/orionRequest';

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
    client: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn()
    },
    token: {
      findFirst: jest.fn(),
      delete: jest.fn()
    },
    enrollment: {
      findMany: jest.fn()
    },
    $transaction: jest.fn()
  }
}));

describe('User service tests', () => {
  let mockUsers: User[] = [
    {
      id: 1,
      name: 'User 1',
      email: 'test@test.com',
      userType: 'ADMIN',
      userData: {},
      clientID: 2
    } as User,
    {
      id: 2,
      name: 'User 2',
      email: 'test1@test.com',
      userType: 'CLIENT',
      userData: {},
      clientID: 1
    } as User
  ];
  describe('Get User by email', () => {
    beforeEach(() => {
      jest.spyOn(prisma.user, 'findUnique').mockImplementation(({ where }) => {
        const user = mockUsers.find((c) => c.email === where.email) || null;
        return { ...user } as Prisma.Prisma__UserClient<User, null>;
      });
    });

    test('should return the user if the email is present', async () => {
      const res = await userService.getUserByEmail('test@test.com');
      expect(res?.id).toBe(1);
      expect(res?.name).toBe('User 1');
    });
    test('should return null if the email is not present', async () => {
      const res = await userService.getUserByEmail('test3@test.com');
      expect(res).toEqual({});
    });
  });

  describe('Create a user with disabled status', () => {
    test('should return an error if the email is already present', async () => {
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(mockUsers[0]);
      expect(
        userService.createUserWithDisabledStatus('test@test.com', '1234', 'JJ', 1)
      ).rejects.toEqual(new Error('Email already taken'));
    });

    test('should create a new user with the required fields', async () => {
      const newUser = {
        id: 3,
        email: 'test@test.com',
        password: '1234',
        name: 'JJ',
        userType: 'USER',
        userData: {},
        clientID: 1
      } as User;
      jest.spyOn(userService, 'getUserByEmail').mockResolvedValueOnce(null);
      jest.spyOn(prisma.user, 'create').mockImplementation(({ data }) => {
        const user =
          ({
            id: 3,
            name: data.name,
            email: data.email,
            password: data.password,
            userType: 'USER',
            clientID: data.clientID
          } as User) || null;
        mockUsers.push(user);

        return { ...user } as unknown as Prisma.Prisma__UserClient<User, never>;
      });
      const res = await userService.createUserWithDisabledStatus(
        newUser.email,
        newUser.password,
        newUser.name,
        newUser.clientID as number
      );
      expect(res.id).toEqual(3);
      expect(mockUsers.length).toEqual(3);
    });
  });

  describe('Get the user by user id', () => {
    beforeEach(() => {
      jest.spyOn(prisma.user, 'findUnique').mockImplementation(({ where }) => {
        const user = mockUsers.find((user) => user.id === where.id) || null;
        return { ...user } as Prisma.Prisma__UserClient<User, null>;
      });
    });

    test('should return the actual user object', async () => {
      const res = await userService.getUserById(1);
      expect(res?.id).toBe(1);
    });

    test('should return null object if the user is not present', async () => {
      const res = await userService.getUserById(9999);
      expect(res).toEqual({});
    });
  });

  describe('Delete the user by id', () => {
    test('should return an error if the user is not present', async () => {
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(null);
      expect(userService.deleteUserById(1)).rejects.toEqual(
        new ApiError(httpStatus.NOT_FOUND, 'User not found')
      );
    });

    test('should delete the user', async () => {
      jest.spyOn(userService, 'getUserById').mockResolvedValueOnce(mockUsers[0]);

      const res = await userService.deleteUserById(1);
      expect(prisma.user.delete).toHaveBeenCalled();
      expect(res).toEqual(mockUsers[0]);
    });
  });

  describe('Enroll a new user', () => {
    const sampleUser: User = {
      id: 10,
      email: '12345@test.com',
      name: 'JJUser',
      password: '1234',
      clientID: 1,
      userData: {},
      userType: 'USER',
      status: 'DISABLED',
      inviteId: null
    };
    const clientID: number = 1;
    let orionRes = { ...mockOrionResponse };
    beforeAll(() => {
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async (email) => {
        const users = mockUsers.filter((u) => u.email === email);
        return users[0];
      });
    });

    beforeEach(() => {
      orionRes = { ...mockOrionResponse };
    });

    test('should return an error if the status code is not 200', async () => {
      orionRes.statusCode = 400;
      jest.spyOn(orionRequest, 'orionRequest').mockResolvedValueOnce(orionRes);
      expect(
        userService.enrollUser(
          sampleUser.email,
          sampleUser.password,
          sampleUser.name,
          clientID,
          sampleUser.userData,
          ''
        )
      ).rejects.toEqual(new ApiError(httpStatus.BAD_REQUEST, 'Orion request failed'));
    });

    test('should return an error if the summary action is Not Passed', async () => {
      orionRes.result.summary.action = 'Fail';
      jest.spyOn(orionRequest, 'orionRequest').mockResolvedValue(orionRes);

      expect(
        userService.enrollUser(
          sampleUser.email,
          sampleUser.password,
          sampleUser.name,
          clientID,
          sampleUser.userData,
          ''
        )
      ).rejects.toEqual(new ApiError(httpStatus.BAD_REQUEST, orionRes.result.summary.message));
    });

    test('should return an error if the user already exists with the particular email', async () => {
      orionRes.result.summary.action = 'Pass';
      const userEmail = 'test@test.com';
      jest.spyOn(userService, 'getUserByEmail').mockImplementation(async (email) => {
        const users = mockUsers.filter((u) => u.email === email);
        return users[0];
      });
      jest.spyOn(orionRequest, 'orionRequest').mockResolvedValue(orionRes);
      expect(
        userService.enrollUser(
          userEmail,
          sampleUser.password,
          sampleUser.name,
          clientID,
          sampleUser.userData,
          ''
        )
      ).rejects.toEqual(
        new ApiError(httpStatus.BAD_REQUEST, `User already exists with a the email ${userEmail}`)
      );
    });

    test('should create a new user', async () => {
      jest.spyOn(orionRequest, 'orionRequest').mockResolvedValue(orionRes);
      jest.spyOn(userService, 'createUserWithDisabledStatus').mockResolvedValueOnce(sampleUser);

      const res = await userService.enrollUser(
        sampleUser.email,
        sampleUser.password,
        sampleUser.name,
        clientID,
        sampleUser.userData,
        sampleUser.status
      );
      expect(res).toEqual({ ...sampleUser });
    });
  });

  describe('Get Sessions by Id', () => {
    beforeEach(() => {
      jest.spyOn(prisma.user, 'findUnique').mockImplementation(({ where }) => {
        const user = mockUsers.find((c) => c.email === where.email) || null;
        return { ...user } as Prisma.Prisma__UserClient<User, null>;
      });
    });

    test('should return null or empty object if the user is not present', async () => {
      const userId = 9999;
      const res = await userService.getSessionsByUserId(userId);
      expect(res).toEqual({});
    });

    test('should return the user details if the user is present', async () => {
      const userId = 1;
      await userService.getSessionsByUserId(userId);
      expect(prisma.user.findUnique).toHaveBeenCalled();
    });
  });

  describe('Get all logs', () => {
    const user: User = { id: 1 } as User;
    const body = { startTime: new Date('2023-06-01'), endTime: new Date('2023-06-30') };
    const mockLogs = [
      {
        session: { id: 1, name: 'Session 1' },
        AttendanceLogs: [
          { id: 1, enrollmentID: 1, dateTime: new Date('2023-06-15'), status: 'PRESENT' },
          { id: 2, enrollmentID: 1, dateTime: new Date('2023-06-20'), status: 'ABSENT' }
        ]
      },
      {
        session: { id: 2, name: 'Session 2' },
        AttendanceLogs: [
          { id: 3, enrollmentID: 2, dateTime: new Date('2023-06-25'), status: 'PRESENT' }
        ]
      }
    ];

    test('should return null or empty object if the user is not present', async () => {
      const mockNullUser: User = { id: 9999 } as User;
      jest.spyOn(prisma.enrollment, 'findMany').mockResolvedValueOnce([]);
      const res = await userService.getLogs(mockNullUser, body);
      expect(res).toEqual([]);
    });

    test('should return the user details if the user is present', async () => {
      jest
        .spyOn(prisma.enrollment, 'findMany')
        .mockResolvedValueOnce(mockLogs as unknown as Enrollment[]);
      const res = await userService.getLogs(user, body);
      expect(prisma.enrollment.findMany).toHaveBeenCalledWith({
        where: {
          userID: user.id,
          session: {
            startDateTime: {
              gte: body.startTime
            },
            endDateTime: {
              lte: body.endTime
            }
          }
        },
        select: {
          session: true,
          AttendanceLogs: true
        }
      });
      expect(res).toEqual(mockLogs);
    });
  });
});

import { User, UserType, Prisma, UserStatus } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';
import * as orionRequest from '../utils/orionRequest';

/**
 * Get user by email
 * @param {string} email
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserByEmail = async <Key extends keyof User>(
  email: string,
  keys: Key[] = ['id', 'email', 'name', 'password', 'userType'] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { email },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createUser = async (
  email: string,
  password: string,
  name: string,
  userData: unknown = {},
  userType: UserType = UserType.USER
): Promise<User> => {
  const res = await userService.getUserByEmail(email, [
    'id',
    'email',
    'name',
    'password',
    'userType'
  ]);
  if (res) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return prisma.user.create({
    data: {
      email: email,
      name: name,
      password: await encryptPassword(password),
      userData: JSON.stringify(userData),
      userType: userType
    }
  });
};

const createUserWithDisabledStatus = async (
  email: string,
  password: string,
  name: string,
  clientID: number,
  userData: unknown = {},
  userType: UserType = UserType.USER,
  status: UserStatus = UserStatus.DISABLED
): Promise<User> => {
  const res = await userService.getUserByEmail(email, [
    'id',
    'email',
    'name',
    'password',
    'userType'
  ]);
  if (res) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return prisma.user.create({
    data: {
      email: email,
      name: name,
      clientID: clientID,
      password: await encryptPassword(password),
      userData: JSON.stringify(userData),
      userType: userType,
      status: status
    }
  });
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @param {Array<Key>} keys
 * @returns {Promise<Pick<User, Key> | null>}
 */
const getUserById = async <Key extends keyof User>(
  id: number,
  keys: Key[] = ['id', 'email', 'name', 'password', 'userType'] as Key[]
): Promise<Pick<User, Key> | null> => {
  return prisma.user.findUnique({
    where: { id },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  }) as Promise<Pick<User, Key> | null>;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<User>}
 */
const deleteUserById = async (userId: number): Promise<User> => {
  const user = await userService.getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await prisma.user.delete({ where: { id: user.id } });
  return user;
};

const enrollUser = async (
  email: string,
  password: string,
  name: string,
  clientID: number,
  userData: unknown = {},
  filePath: string
) => {
  const result = await orionRequest.orionRequest(filePath, email);

  if (result.statusCode !== 200) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Orion request failed');
  } else if (result.result.summary.action === 'Fail') {
    throw new ApiError(httpStatus.BAD_REQUEST, result.result.summary.message);
  }
  const it = result.result.data.matches.internal;
  let userFound = false,
    user = undefined;

  for (let i = 0; i < it.length; i++) {
    const email = it[i].transactionId;
    user = await userService.getUserByEmail(email);
    if (user) {
      userFound = true;
      break;
    }
  }

  if (userFound) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `User already exists with a the email ${user?.email}`
    );
  }

  return userService.createUserWithDisabledStatus(email, password, name, clientID, userData);
};

const getSessionsByUserId = async (userId: number) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      Enrollments: {
        select: {
          session: true
        }
      }
    }
  });
};
const getLogs = async (user: User, body: { startTime: Date, endTime: Date }) => {
  const res = await prisma.enrollment.findMany({
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
  return res;
};

const userService = {
  createUser,
  getUserById,
  getUserByEmail,
  deleteUserById,
  enrollUser,
  createUserWithDisabledStatus,
  getSessionsByUserId,
  getLogs
};

export default userService;

export { createUser, getUserById, getUserByEmail, deleteUserById };

import { User, UserType, Prisma } from '@prisma/client';
import httpStatus from 'http-status';
import prisma from '../client';
import ApiError from '../utils/ApiError';
import { encryptPassword } from '../utils/encryption';

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
  console.log(res);
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

/**
 * Query for users
 * @param {Object} filter - Prisma filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryUsers = async <Key extends keyof User>(
  filter: object,
  options: {
    limit?: number;
    page?: number;
    sortBy?: string;
    sortType?: 'asc' | 'desc';
  },
  keys: Key[] = ['id', 'email', 'name', 'password', 'userType'] as Key[]
): Promise<Pick<User, Key>[]> => {
  const page = options.page ?? 1;
  const limit = options.limit ?? 10;
  const sortBy = options.sortBy;
  const sortType = options.sortType ?? 'desc';
  const users = await prisma.user.findMany({
    where: filter,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {}),
    skip: page * limit,
    take: limit,
    orderBy: sortBy ? { [sortBy]: sortType } : undefined
  });
  return users as Pick<User, Key>[];
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
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<User>}
 */
const updateUserById = async <Key extends keyof User>(
  userId: number,
  updateBody: Prisma.UserUpdateInput,
  keys: Key[] = ['id', 'email', 'name', 'userType'] as Key[]
): Promise<Pick<User, Key> | null> => {
  const user = await userService.getUserById(userId, ['id', 'email', 'name']);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await userService.getUserByEmail(updateBody.email as string))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: updateBody,
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  });
  return updatedUser as Pick<User, Key> | null;
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

const userService = {
  createUser,
  queryUsers,
  getUserById,
  getUserByEmail,
  updateUserById,
  deleteUserById
};

export default userService;

export { createUser, queryUsers, getUserById, getUserByEmail, updateUserById, deleteUserById };
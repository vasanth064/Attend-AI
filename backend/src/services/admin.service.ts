import { User, UserType, Client } from '@prisma/client';
import prisma from '../client';

import userService from './user.service';

import { encryptPassword } from '../utils/encryption';

const createClient = async (
  email: string,
  password: string,
  name: string,
  userData: unknown = {}
): Promise<User> => {
  const user = await userService.getUserByEmail(email);
  if (user) {
    throw new Error('A type of user already exists with this email');
  }

  const newClientObject = await prisma.client.create({
    data: {
      name: name
    }
  });
  const newUser = await prisma.user.create({
    data: {
      email: email,
      name: name,
      password: await encryptPassword(password),
      userData: JSON.stringify(userData),
      userType: UserType.CLIENT,
      clientID: newClientObject.id
    }
  });

  return newUser;
};

const adminService = {
  createClient
};

export default adminService;

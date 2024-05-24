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

const getClientUserById = async <Key extends keyof User>(
  clientId: number,
  keys: Key[] = ['id', 'email', 'name', 'password', 'userType'] as Key[]
): Promise<Pick<User, Key> | null> => {
  return (await prisma.user.findUnique({
    where: { id: clientId },
    select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
  })) as Pick<User, Key> | null;
};

const getClientById = async (clientId: number) => {
  return await prisma.client.findUnique({ where: { id: clientId } });
};

const getClientUserByClientId = async (clientId: number) => {
  const client = await adminService.getClientById(clientId);
  if (!client) {
    throw new Error('Client not found');
  }
  const users = await prisma.user.findMany({
    where: { clientID: clientId, userType: UserType.CLIENT },
    select: { id: true, email: true, name: true, password: true, userType: true, clientID: true }
  });

  if (users.length === 0 || users[0].userType !== UserType.CLIENT) {
    throw new Error('Client does not have any users');
  }
  return users[0];
};

const deleteClient = async (clientId: number): Promise<void> => {
  const client = await adminService.getClientById(clientId);
  const clientUser = await adminService.getClientUserByClientId(clientId);
  if (!client) {
    throw new Error('Client not found');
  }
  if (clientUser.userType !== UserType.CLIENT) {
    throw new Error('Only clients be managed');
  }
  if (!clientUser.clientID) {
    throw new Error('Client does not have a clientID');
  }
  await prisma.client.delete({ where: { id: clientId } });
  await prisma.user.delete({ where: { id: clientUser.id } });
};

const getAllClients = async () => {
  return await prisma.client.findMany();
};

const adminService = {
  createClient,
  deleteClient,
  getClientUserById,
  getClientById,
  getClientUserByClientId,
  getAllClients
};

export default adminService;

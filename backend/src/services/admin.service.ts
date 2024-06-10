import { User, UserType, Client } from '@prisma/client';
import prisma from '../client';

import userService from './user.service';

import { encryptPassword } from '../utils/encryption';

const createClientObject = async (name: string) => {
  return await prisma.client.create({
    data: {
      name: name
    }
  })
}

const createClient = async (
  email: string, password: string,
  name: string,
  userData: unknown = {}
): Promise<User> => {
  const user = await userService.getUserByEmail(email);
  if (user) {
    throw new Error('A type of user already exists with this email');
  }

  const newClientObject = await adminService.createClientObject(name);
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

// const getClientUserById = async <Key extends keyof User>(
//   clientId: number,
//   keys: Key[] = ['id', 'email', 'name', 'password', 'userType'] as Key[]
// ): Promise<Pick<User, Key> | null> => {
//   return (await prisma.user.findUnique({
//     where: { id: clientId },
//     select: keys.reduce((obj, k) => ({ ...obj, [k]: true }), {})
//   })) as Pick<User, Key> | null;
// };

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


const deleteClientHelper = async (clientId: number) => {
  await prisma.$transaction(async (tx) => {
    await tx.client.delete({ where: { id: clientId } });
  })
}

const deleteClient = async (clientId: number): Promise<void> => {
  // Delete the sessions
  const client = await adminService.getClientById(clientId);
  await adminService.getClientUserByClientId(clientId);
  if (!client) {
    throw new Error('Client not found');
  }

  await adminService.deleteClientHelper(clientId);
};

const getAllClients = async () => {
  return await prisma.client.findMany();
};

const adminService = {
  createClient,
  deleteClient,
  // getClientUserById,
  getClientById,
  getClientUserByClientId,
  getAllClients,
  createClientObject,
  deleteClientHelper
};

export default adminService;

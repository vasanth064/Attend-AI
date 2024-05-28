import { InviteConfig, Session, UserStatus } from '@prisma/client';
import prisma from '../client';
import userService from './user.service';

import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';

import { encryptPassword } from '../utils/encryption';
import { User, UserType } from '@prisma/client';

interface Config {
  label: string;
  type: string;
  options?: any[];
}

const createLink = async (clientID: number, config: Config[]): Promise<InviteConfig> => {
  const newLink = await prisma.inviteConfig.create({
    data: {
      clientID: clientID,
      config: JSON.stringify(config)
    }
  });
  return newLink;
};

const getInviteLinks = async (clientID: number): Promise<InviteConfig[]> => {
  const inviteLinks = await prisma.inviteConfig.findMany({
    where: {
      clientID: clientID
    }
  });
  return inviteLinks;
};

const getInviteLink = async (linkID: number): Promise<InviteConfig | null> => {
  const inviteLink = await prisma.inviteConfig.findUnique({
    where: {
      id: linkID
    }
  });
  return inviteLink;
};

const deleteLink = async (linkID: number): Promise<void> => {
  await prisma.inviteConfig.delete({
    where: {
      id: linkID
    }
  });
};

const createSession = async (
  clientID: number,
  name: string,
  startDateTime: Date,
  endDateTime: Date
): Promise<Session> => {
  const session = await prisma.session.create({
    data: {
      clientID: clientID,
      name: name,
      startDateTime: startDateTime,
      endDateTime: endDateTime
    }
  });
  return session;
};

const getSessions = async (clientID: number): Promise<Session[]> => {
  const sessions = await prisma.session.findMany({
    where: {
      clientID: clientID
    }
  });
  return sessions;
};

const getSession = async (sessionID: number): Promise<Session | null> => {
  const session = await prisma.session.findUnique({
    where: {
      id: sessionID
    }
  });
  return session;
};

const deleteSession = async (sessionID: number): Promise<void> => {
  await prisma.session.delete({
    where: {
      id: sessionID
    }
  });
};

const updateSession = async (
  sessionID: number,
  name: string,
  startDateTime: Date,
  endDateTime: Date
): Promise<Session> => {
  const updatedSession = await prisma.session.update({
    where: {
      id: sessionID
    },
    data: {
      name: name,
      startDateTime: startDateTime,
      endDateTime: endDateTime
    }
  });
  return updatedSession;
};

const createMachine = async (name: string, email: string, password: string, clientID: number) => {
  const user = await userService.getUserByEmail(email);
  if (user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  return await prisma.user.create({
    data: {
      name: name,
      email: email,
      password: await encryptPassword(password),
      userType: UserType.MACHINE,
      clientID: clientID
    }
  });
};

const deleteMachineById = async (machineID: number): Promise<void> => {
  await prisma.token.deleteMany({
    where: {
      userId: machineID
    }
  });

  await prisma.user.delete({
    where: {
      id: machineID
    }
  });
};

const getAllMachines = async (clientID: number): Promise<User[]> => {
  const machines = await prisma.user.findMany({
    where: {
      clientID: clientID,
      userType: UserType.MACHINE
    }
  });
  return machines;
};

const getEnrollment = async (sessionID: number, userID: number) => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userID: userID,
      SessionID: sessionID
    }
  });
  return enrollment;
};

const approveUserCreations = async (userIDs: number[], clientID: number) => {
  return await prisma.user.updateMany({
    where: {
      id: {
        in: userIDs
      },
      clientID: clientID
    },
    data: {
      status: UserStatus.ENABLED
    }
  });
};

const enrollUserToSession = async (sessionID: number, userID: number, clientID: number) => {
  const session = await clientService.getSession(sessionID);
  if (!session || session.clientID !== clientID) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }

  const user = await userService.getUserById(userID);
  if (!user || user.userType !== UserType.USER || user.status === UserStatus.DISABLED) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const enrollment = await clientService.getEnrollment(sessionID, userID);
  if (enrollment) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already enrolled to this session');
  }

  const newEnrollment = await prisma.enrollment.create({
    data: {
      userID: userID,
      SessionID: sessionID
    }
  });
  return newEnrollment;
};

const clientService = {
  createLink,
  getInviteLinks,
  getInviteLink,
  deleteLink,
  createSession,
  getSessions,
  getSession,
  deleteSession,
  updateSession,
  createMachine,
  deleteMachineById,
  getAllMachines,
  enrollUserToSession,
  getEnrollment,
  approveUserCreations
};

export default clientService;

export {
  createLink,
  getInviteLinks,
  getInviteLink,
  deleteLink,
  createSession,
  getSessions,
  getSession,
  deleteSession,
  createMachine,
  getAllMachines
};

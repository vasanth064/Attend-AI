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

const createLink = async (
  clientID: number,
  config: Config[],
  name: string
): Promise<InviteConfig> => {
  const newLink = await prisma.inviteConfig.create({
    data: {
      clientID: clientID,
      config: JSON.stringify(config),
      name: name
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
  if (inviteLinks.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invite links not found');
  }
  return inviteLinks;
};

const getInviteLink = async (linkID: number): Promise<InviteConfig | null> => {
  const inviteLink = await prisma.inviteConfig.findUnique({
    where: {
      id: linkID
    }
  });
  if (!inviteLink) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invite link not found');
  }
  return inviteLink;
};

const deleteLink = async (linkID: number): Promise<void> => {
  const inviteLink = await prisma.inviteConfig.findUnique({
    where: {
      id: linkID
    }
  });
  if (!inviteLink) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invite link not found');
  }
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
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime)
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
  if (sessions.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Sessions not found');
  }
  return sessions;
};

const getSession = async (sessionID: number): Promise<Session | null> => {
  const session = await prisma.session.findUnique({
    where: {
      id: sessionID
    }
  });
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
  return session;
};

const deleteSession = async (sessionID: number): Promise<void> => {
  const session = await prisma.session.findUnique({
    where: {
      id: sessionID
    }
  });
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
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
  const session = await prisma.session.findUnique({
    where: {
      id: sessionID
    }
  });
  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }
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
  if (machines.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Machines not found');
  }
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

const getInvitedUsers = async (inviteId: number, clientID: number, status: UserStatus) => {
  if (status === UserStatus.ENABLED) {
    const invitedUsers = await prisma.user.findMany({
      where: {
        inviteId,
        clientID,
        status: UserStatus.ENABLED
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        status: true,
        userData: true,
        inviteId: true,
        clientID: true
      }
    });
    if (invitedUsers.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No users found');
    }
    return invitedUsers;
  } else if (status === UserStatus.DISABLED) {
    const invitedUsers = await prisma.user.findMany({
      where: {
        inviteId,
        clientID,
        status: UserStatus.DISABLED
      },
      select: {
        id: true,
        name: true,
        email: true,
        userType: true,
        status: true,
        userData: true,
        inviteId: true,
        clientID: true
      }
    });
    if (invitedUsers.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No users found');
    }
    return invitedUsers;
  }
};

const getUserByClientID = async (clientID: number) => {
  const users = await prisma.user.findMany({
    where: {
      clientID
    },
    select: {
      id: true,
      name: true,
      email: true,
      userType: true,
      status: true,
      userData: true,
      inviteId: true,
      clientID: true
    }
  });
  if (users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return users;
};

const getUserBySessionID = async (sessionID: number) => {
  const users = await prisma.user.findMany({
    where: {
      Enrollments: {
        some: {
          session: {
            id: sessionID
          }
        }
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      userType: true,
      status: true,
      userData: true,
      inviteId: true,
      clientID: true
    }
  });
  if (users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return users;
};

const getUserNotEnrolledToSession = async (
  sessionID: string,
  inviteID: string,
  clientID: number
) => {
  const users = await prisma.user.findMany({
    where: {
      NOT: {
        Enrollments: {
          some: {
            SessionID: parseInt(sessionID)
          }
        }
      },
      inviteId: parseInt(inviteID),
      clientID: clientID
    }
  });
  if (users.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  return users;
};

const deleteUserEnrollments = async (userID: number, sessionID: number) => {
  await prisma.enrollment.deleteMany({
    where: {
      userID,
      SessionID: sessionID
    }
  });
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


const getLogsOfSession = async (sessionID: number) => {
  console.log(sessionID);
  const res = await prisma.enrollment.findMany({
    where: {
      SessionID: sessionID
    },
    select: {
      session: true,
      AttendanceLogs: true
    }
  })

  return res;
}
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
  getUserBySessionID,
  getUserByClientID,
  enrollUserToSession,
  getUserNotEnrolledToSession,
  deleteUserEnrollments,
  getEnrollment,
  getInvitedUsers,
  approveUserCreations,
  getLogsOfSession
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
  getUserBySessionID,
  getUserByClientID,
  getInvitedUsers,
  getAllMachines,
  getLogsOfSession
  getUserNotEnrolledToSession,
  deleteUserEnrollments
};

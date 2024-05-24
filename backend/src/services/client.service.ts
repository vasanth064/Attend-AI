import { InviteConfig, Session } from '@prisma/client';
import prisma from '../client';

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

const clientService = {
  createLink,
  getInviteLinks,
  getInviteLink,
  deleteLink,
  createSession,
  getSessions,
  getSession,
  deleteSession,
  updateSession
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
  deleteSession
};

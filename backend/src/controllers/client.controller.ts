import { User } from '@prisma/client';
import { clientService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const createLink = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { config } = req.body;
  const newLink = await clientService.createLink(clientID, config);
  res.status(httpStatus.CREATED).send({ newLink });
});

const getInviteLinks = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  console.log(clientID);
  const inviteLinks = await clientService.getInviteLinks(clientID);
  res.status(httpStatus.OK).send({ inviteLinks });
});

const getInviteLink = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { linkID } = req.params;
  const inviteLink = await clientService.getInviteLink(parseInt(linkID));
  res.status(httpStatus.OK).send({ inviteLink });
});

const deleteLink = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { linkID } = req.params;
  await clientService.deleteLink(parseInt(linkID));
  res.status(httpStatus.OK).send({ message: 'Link deleted' });
});

export const createSession = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { name, startDateTime, endDateTime } = req.body;
  const session = await clientService.createSession(clientID, name, startDateTime, endDateTime);
  res.status(httpStatus.CREATED).send({ session });
});

const getSessions = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const sessions = await clientService.getSessions(clientID);
  res.status(httpStatus.OK).send({ sessions });
});

const getSession = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { sessionID } = req.params;
  const session = await clientService.getSession(parseInt(sessionID));
  res.status(httpStatus.OK).send({ session });
});

const deleteSession = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { sessionID } = req.params;
  await clientService.deleteSession(parseInt(sessionID));
  res.status(httpStatus.OK).send({ message: 'Session deleted' });
});

const updateSession = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { sessionID } = req.params;
  const { name, startDateTime, endDateTime } = req.body;
  const session = await clientService.getSession(parseInt(sessionID));

  if (!session) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Session not found');
  }

  if (session.clientID !== clientID) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized to update this session');
  }

  const updatedSession = await clientService.updateSession(
    parseInt(sessionID),
    name,
    startDateTime,
    endDateTime
  );
  res.status(httpStatus.OK).send({ session: updatedSession });
});

export default {
  createLink,
  getInviteLinks,
  deleteLink,
  getInviteLink,
  createSession,
  getSessions,
  getSession,
  deleteSession,
  updateSession
};

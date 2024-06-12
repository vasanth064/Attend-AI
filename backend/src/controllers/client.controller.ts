import { User, UserStatus } from '@prisma/client';
import { clientService } from '../services';
import catchAsync from '../utils/catchAsync';
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';

const createLink = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { config, name } = req.body;
  const newLink = await clientService.createLink(clientID, config, name);
  res.status(httpStatus.CREATED).send(newLink);
});

const getInviteLinks = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const inviteLinks = await clientService.getInviteLinks(clientID);
  res.status(httpStatus.OK).send(inviteLinks);
});

const getInviteLink = catchAsync(async (req, res) => {
  const { linkID } = req.params;
  const inviteLink = await clientService.getInviteLink(parseInt(linkID));
  res.status(httpStatus.OK).send(inviteLink);
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

const createMachine = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Authorization error');
  }

  const { name, email, password } = req.body;
  const machine = await clientService.createMachine(name, email, password, clientID);
  res.status(httpStatus.CREATED).send({ machine });
});

const deleteMachine = catchAsync(async (req, res) => {
  const { machineID } = req.params;
  await clientService.deleteMachineById(parseInt(machineID));
  res.status(httpStatus.OK).send({ message: 'Machine deleted' });
});

const getAllMachines = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const machines = await clientService.getAllMachines(clientID);
  res.status(httpStatus.OK).send(machines);
});

const getAllInvitedUsers = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }
  const { inviteId, status } = req.query;
  if (!inviteId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invite ID is required');
  }
  if (!status) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Status is required');
  }
  const invitedUsers = await clientService.getInvitedUsers(
    parseInt(inviteId as string),
    clientID,
    status as UserStatus
  );
  res.status(httpStatus.OK).send(invitedUsers);
});

const approveUserCreations = catchAsync(async (req, res) => {
  const clientUser = req.user as User;
  const { userIDs } = req.body;

  if (!clientUser.clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Not a valid client user, login');
  }
  const updataedUsers = await clientService.approveUserCreations(userIDs, clientUser.clientID);
  res.status(httpStatus.OK).send({ message: 'User creations approved', updataedUsers });
});

const enrollUserToSession = catchAsync(async (req, res) => {
  const { clientID } = req.user as User;
  if (!clientID) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Client ID is required');
  }

  const { sessionID, userID } = req.body;
  const session = await clientService.enrollUserToSession(
    parseInt(sessionID),
    parseInt(userID),
    clientID
  );
  res.status(httpStatus.OK).send({ message: `User ${userID} enrolled to session`, session });
});

const getLogsOfSession = catchAsync(async (req, res) => {
  const { id } = req.params;
  const logs = await clientService.getLogsOfSession(parseInt(id));

  res.send(logs);
})

export default {
  createLink,
  getInviteLinks,
  deleteLink,
  getInviteLink,
  createSession,
  getSessions,
  getSession,
  deleteSession,
  updateSession,
  createMachine,
  deleteMachine,
  getAllMachines,
  approveUserCreations,
  enrollUserToSession,
  getAllInvitedUsers,
  getLogsOfSession
};

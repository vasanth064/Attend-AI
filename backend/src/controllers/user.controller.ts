import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { adminService, userService } from '../services';
import { User } from '@prisma/client';

const createUser = catchAsync(async (req, res) => {
  const { email, password, name, role } = req.body;
  const user = await userService.createUser(email, password, name, role);
  res.status(httpStatus.CREATED).send(user);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

const enrollUser = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File is required');
  }
  let { email, password, name, inviteId, ...userData } = req.body;

  const user = await userService.getUserByEmail(email, [
    'id',
    'email',
    'name',
    'password',
    'userType'
  ]);
  if (user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User already exists');
  }


  const newUser = await userService.enrollUser(
    email,
    password,
    name,
    userData,
    req.file.path,
    parseInt(inviteId)
  );
  res.status(httpStatus.CREATED).send(newUser);
});

const getSessions = catchAsync(async (req, res) => {
  const user = req.user as User;
  const sessions = await userService.getSessionsByUserId(user.id);
  res.status(httpStatus.OK).send(sessions);
});



const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

const getLogs = catchAsync(async (req, res) => {
  const user = req.user as User;
  const result = await userService.getLogs(user, req.body);
  res.status(httpStatus.OK).send(result);
})

export default {
  createUser,
  getUser,
  deleteUser,
  enrollUser,
  getSessions,
  getLogs
};

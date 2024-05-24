import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { authService, userService, tokenService, emailService, adminService } from '../services';
import exclude from '../utils/exclude';

const createClient = catchAsync(async (req, res) => {
  const { email, password, name, userData } = req.body;
  const newUser = await adminService.createClient(email, password, name, userData);
  res.status(httpStatus.CREATED).send({ user: exclude(newUser, ['password']) });
});

const getAllClients = catchAsync(async (req, res) => {
  // TODO
});

export default {
  createClient,
  getAllClients
};

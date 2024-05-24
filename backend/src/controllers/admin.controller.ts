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
  res.status(httpStatus.OK).send(await adminService.getAllClients());
});

const getClientById = catchAsync(async (req, res) => {
  const { clientId } = req.params;
  const user = await adminService.getClientById(parseInt(clientId));
  if (!user) {
    res.status(httpStatus.NOT_FOUND).send({ message: 'User not found' });
  }
  res.status(httpStatus.OK).send(user);
});

const deleteClient = catchAsync(async (req, res) => {
  const { clientId } = req.params;
  await adminService.deleteClient(parseInt(clientId));
  res.status(httpStatus.OK).send({ message: 'Client deleted' });
});

export default {
  createClient,
  getAllClients,
  deleteClient,
  getClientById
};

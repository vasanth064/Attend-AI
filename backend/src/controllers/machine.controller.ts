import httpStatus from 'http-status';
import pick from '../utils/pick';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import { adminService, userService } from '../services';
import { User } from '@prisma/client';

const markAttendance = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file provided');
  }
  const { path } = req.file;

  res.send({ message: 'Attendance marked' });
});

export default {
  markAttendance
};

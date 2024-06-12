import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import catchAsync from '../utils/catchAsync';
import machineService from '../services/machine.service';
import fs from 'fs';
import logger from '../config/logger';
import { User } from '@prisma/client';

const markAttendance = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'No file provided');
  }
  const { path } = req.file;
  try {
    const { sessionID } = req.body;
    const result = await machineService.markAttendance(parseInt(sessionID), path);
    res.send({ message: 'Attendance marked', ...result });
  } finally {
    fs.unlink(path, (err) => {
      if (err) {
        logger.error(err);
      }
    });
  }
});

const upcomingSessions = catchAsync(async (req, res) => {
  const user = req.user as User;
  if (user.clientID === null)
    throw new Error("Invalid request to this endpoint");

  const result = await machineService.upComingSessions(user.clientID);
  res.send({ sessions: result });
})

export default {
  markAttendance,
  upcomingSessions
};

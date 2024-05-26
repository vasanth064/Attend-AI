import prisma from '../client';
import ApiError from '../utils/ApiError';
import orionRequest from '../utils/orionRequest';
import clientService from './client.service';

const searchUser = async (filepath: string) => {
  const result = await orionRequest(filepath);

  if (result.statusCode !== 200) {
    throw new ApiError(400, 'Face not found in database');
  }

  const it = result.result.data.matches.internal;
  let user = undefined,
    imgUrl = '';
  let email;
  for (let i = 0; i < it.length; i++) {
    email = it[i].transactionId;
    user = await prisma.user.findUnique({
      where: {
        email
      }
    });
    if (user) {
      imgUrl = it[i].selfie.url;
      break;
    }
  }
  if (!user) {
    throw new ApiError(400, 'Face not found in database');
  }

  return { user, imgUrl };
};

const markAttendance = async (sessionID: number, filepath: string) => {
  const session = await clientService.getSession(sessionID);
  if (!session) {
    throw new ApiError(400, 'Session not found');
  }
  const { user, imgUrl } = await searchUser(filepath);

  // Corresponding enrollment
  const enrollment = await clientService.getEnrollment(sessionID, user.id);

  if (!enrollment) {
    throw new ApiError(400, 'User not enrolled to this session');
  }

  if (
    Date.now() < session.startDateTime.getUTCMilliseconds() ||
    Date.now() > session.endDateTime.getUTCMilliseconds()
  ) {
    throw new ApiError(400, 'Session is not active');
  }

  // Create a log
  const log = await prisma.attendanceLogs.create({
    data: {
      enrollmentID: enrollment.id,
      attendanceMarkedAt: new Date()
    }
  });

  return { ...log, user, imgUrl };
};

const machineService = {
  markAttendance
};

export default machineService;

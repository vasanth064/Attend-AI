import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import passport from 'passport';
import httpStatus from 'http-status';
import config from './config/config';
import morgan from './config/morgan';
import xss from './middlewares/xss';
import { jwtStrategy } from './config/passport';
import { authLimiter } from './middlewares/rateLimiter';
import routes from './routes/v1';
import { errorConverter, errorHandler } from './middlewares/error';
import ApiError from './utils/ApiError';
import prisma from './client';
import { encryptPassword } from './utils/encryption';
import { UserStatus, UserType } from '@prisma/client';
import { adminService, clientService } from './services';

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

if (config.env === 'test') {
  console.log("Test environment");
  (async () => {
    try {
      const res = await prisma.user.create({
        data: {
          name: "Admin",
          email: "test@test.com",
          password: await encryptPassword("1234"),
          userType: UserType.ADMIN
        }
      });

      // Create a client user
      const client = await adminService.createClient("client2@gmail.com", "1234", "Client 2");
      if (client.clientID === null)
        throw new Error("error");

      const inviteLink = await clientService.createLink(client.clientID, [], "Invite 1");

      // Create a sample user
      const user = await prisma.user.create({
        data: {
          name: "User 1",
          email: "user@test.com",
          password: await encryptPassword("1234"),
          userType: UserType.USER,
          clientID: client.clientID,
          status: UserStatus.DISABLED,
          inviteId: inviteLink.id
        }
      });

      const machine = await clientService.createMachine("Machine 1", "machine1@gmail.com", await encryptPassword("1234"), client.clientID);

      console.log(`Admin Created: email ${res.email} password 1234`);
      console.log(user);
      console.log(machine);
    } catch (err) {
      console.log(err)
    }
  })()

}

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/v1/auth', authLimiter);
}

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;

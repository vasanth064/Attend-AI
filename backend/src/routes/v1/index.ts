import express from 'express';
import authRoute from './auth.route';
import userRoute from './user.route';
import docsRoute from './docs.route';
import adminRoute from './admin.route';
import config from '../../config/config';
import clientRoute from './client.route';
import machineRoute from './machine.route';
import prisma from '../../client';
import { encryptPassword } from '../../utils/encryption';
import { authService, userService } from '../../services';

const router = express.Router();

router.route('/').get(async (req, res) => {
  const admin = await prisma.user.findFirst({
    where: {
      email: 'admin@attendai.com'
    }
  });
  if (!admin) {
    await userService.createUser('admin@attendai.com', 'admin@attendai.com', 'admin', 'ADMIN');
    return res.status(200).json({
      message: 'Working :))'
    });
  }
  res.status(200).json({
    message: 'Working :)'
  });
});

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute
  },
  {
    path: '/users',
    route: userRoute
  },
  {
    path: '/admin',
    route: adminRoute
  },
  {
    path: '/client',
    route: clientRoute
  },
  {
    path: '/machine',
    route: machineRoute
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

export default router;

import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';

import { adminValidation } from '../../validations';
import { adminController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('manageUsers'), validate(adminValidation.createClient), adminController.createClient)
  .get(auth('getUsers', 'manageUsers'), adminController.getAllClients)
  .delete(auth('manageUsers'));
export default router;

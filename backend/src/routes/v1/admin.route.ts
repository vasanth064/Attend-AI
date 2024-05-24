import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';

import { adminValidation } from '../../validations';
import { adminController } from '../../controllers';

const router = express.Router();

router
  .route('/')
  .post(auth('manageClients'), validate(adminValidation.createClient), adminController.createClient)
  .get(auth('getClients', 'manageClients'), adminController.getAllClients);

router
  .route('/:clientId')
  .get(auth('getClients'), validate(adminValidation.getAllClients), adminController.getClientById)
  .delete(
    auth('manageClients'),
    validate(adminValidation.deleteClient),
    adminController.deleteClient
  );
export default router;

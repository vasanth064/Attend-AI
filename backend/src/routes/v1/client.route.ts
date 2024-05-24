import express from 'express';
import validate from '../../middlewares/validate';
import clientValidation from '../../validations/client.validation';
import { clientController } from '../../controllers';
import auth from '../../middlewares/auth';

const router = express.Router();

router
  .route('/link')
  .post(
    auth('manageInviteLinks'),
    validate(clientValidation.createLink),
    clientController.createLink
  )
  .get(auth('manageInviteLinks'), clientController.getInviteLinks);

router
  .route('/link/:linkID')
  .delete(auth('manageInviteLinks'), clientController.deleteLink)
  .get(auth('manageInviteLinks'), clientController.getInviteLink);

router
  .route('/session')
  .post(auth('manageSessions'), validate(clientValidation.session), clientController.createSession)
  .get(auth('manageSessions'), clientController.getSessions);

router
  .route('/session/:sessionID')
  .put(auth('manageSessions'), validate(clientValidation.session), clientController.updateSession)
  .delete(auth('manageSessions'), clientController.deleteSession)
  .get(auth('manageSessions'), clientController.getSession);

export default router;

/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Client
 */

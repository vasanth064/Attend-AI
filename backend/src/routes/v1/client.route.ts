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
  .get(clientController.getInviteLink);

router
  .route('/approve-users')
  .post(
    auth('manageUsers'),
    validate(clientValidation.approveUserCreation),
    clientController.approveUserCreations
  );

router
  .route('/session')
  .post(auth('manageSessions'), validate(clientValidation.session), clientController.createSession)
  .get(auth('manageSessions'), clientController.getSessions);

router
  .route('/session/:sessionID')
  .put(auth('manageSessions'), validate(clientValidation.session), clientController.updateSession)
  .delete(auth('manageSessions'), clientController.deleteSession)
  .get(auth('manageSessions'), clientController.getSession);

router
  .route('/machine')
  .post(
    auth('manageMachines'),
    validate(clientValidation.createMachine),
    clientController.createMachine
  )
  .get(auth('manageMachines'), clientController.getAllMachines);

router
  .route('/machine/:machineID')
  .delete(
    auth('manageMachines'),
    validate(clientValidation.deleteMachine),
    clientController.deleteMachine
  );

router
  .route('/enroll')
  .post(
    auth('manageUsers'),
    validate(clientValidation.enrollUserToSession),
    clientController.enrollUserToSession
  );

export default router;

/**
 * @swagger
 * tags:
 *   name: Client
 *   description: Client
 */

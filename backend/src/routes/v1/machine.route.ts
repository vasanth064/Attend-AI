import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';

import { machineController } from '../../controllers';

import Joi, { valid } from 'joi';

import multer from 'multer';

var upload = multer({ dest: './uploads/' });

const router = express.Router();

const searchSchema = Joi.object().keys({
  body: Joi.object({
    sessionID: Joi.number().required()
  })
});

router.get('/getLogs', auth('markAttendance'), machineController.upcomingSessions)

router
  .route('/')
  .post(
    auth('markAttendance'),
    upload.single('file'),
    validate(searchSchema),
    machineController.markAttendance
  )


export default router;

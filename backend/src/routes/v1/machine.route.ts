import express from 'express';
import auth from '../../middlewares/auth';
import validate from '../../middlewares/validate';

import { machineController } from '../../controllers';

import multer from 'multer';

var upload = multer({ dest: './uploads/' });

const router = express.Router();

router
  .route('/')
  .post(auth('manageAttendance'), upload.single('file'), machineController.markAttendance);

export default router;

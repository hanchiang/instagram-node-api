import express from 'express';

import * as controller from '../controllers';
import { catchErrors } from '../handlers/errorHandlers';

const router = express.Router();

router.get('/media/user/:username', catchErrors(controller.getUserMedia));

export default router;

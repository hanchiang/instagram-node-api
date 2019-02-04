const router = require('express').Router();


const controller = require('../controllers');
const { catchErrors } = require('../handlers/errorHandlers');


router.get('/media/user/:username', catchErrors(controller.getUserMedia));

module.exports = router;

const express = require('express');
const router = express.Router();
const AuthController = require('../../controllers/auth.controller');
const validate = require('../../middlewares/validate.middleware');


router.post('/register', validate('registerSchema'), AuthController.register);
router.post('/login', validate('loginSchema'), AuthController.login);
router.post('/refresh', AuthController.refreshToken);
router.post('/logout', AuthController.logout);


module.exports = router;
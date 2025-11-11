const express = require('express');
const router = express.Router();
const userCtrl = require('../../controllers/user.controller');
const auth = require('../../middlewares/auth.middleware');
const role = require('../../middlewares/role.middleware');

router.get('/me', auth, userCtrl.getProfile);
router.get('/', auth, role(['Admin', 'Manager']), userCtrl.list);
router.post('/', auth, role(['Admin']), userCtrl.create);

module.exports = router;
const express = require('express');
const router = express.Router();
const ctrl = require('../../controllers/contract.controller');
const auth = require('../../middlewares/auth.middleware');

router.post('/', auth, ctrl.create);
router.get('/:id', auth, ctrl.get);

module.exports = router;
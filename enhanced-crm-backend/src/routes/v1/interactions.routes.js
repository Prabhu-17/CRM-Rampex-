const express = require('express');
const router = express.Router();
const inter = require('../../controllers/interaction.controller');
const auth = require('../../middlewares/auth.middleware');

router.post('/', auth, inter.create);
router.get('/client/:clientId', auth, inter.listForClient);

module.exports = router;
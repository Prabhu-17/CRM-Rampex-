const express = require('express');
const router = express.Router();
const lead = require('../../controllers/lead.controller');
const auth = require('../../middlewares/auth.middleware');

router.post('/', auth, lead.create);
router.patch('/:id/stage', auth, lead.updateStage);

module.exports = router;
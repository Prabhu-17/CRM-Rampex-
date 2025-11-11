const express = require('express');
const router = express.Router();
const client = require('../../controllers/client.controller');
const auth = require('../../middlewares/auth.middleware');

router.post('/', auth, client.create);
router.get('/:id', auth, client.get);
router.get('/', auth, client.search);

module.exports = router;
const express = require('express');
const router = express.Router();
router.use('/auth', require('./auth.routes'));
router.use('/users', require('./users.routes'));
router.use('/clients', require('./clients.routes'));
router.use('/leads', require('./leads.routes'));
router.use('/interactions', require('./interactions.routes'));
router.use('/contracts', require('./contracts.routes'));
module.exports = router;
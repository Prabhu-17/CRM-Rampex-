const express = require('express');
const router = express.Router();
router.use('/auth', require('./auth.routes'));
router.use('/admin', require('./admin.routes'))
router.use('/ai', require('./ai.routes'))
router.use('/automation', require('./automation.routes'))
router.use('/users', require('./users.routes'));
router.use('/clients', require('./clients.routes'));
router.use('/dashboard', require('./dashboard.routes'))
router.use('/leads', require('./leads.routes'));
router.use('/notifications', require('./notification.routes'))
router.use('/interactions', require('./interactions.routes'));
router.use('/contracts', require('./contracts.routes'));
router.use('/reports', require('./reports.routes'));
module.exports = router;
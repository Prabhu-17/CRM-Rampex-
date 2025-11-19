const router = require('express').Router()
const auth = require('../../middlewares/auth.middleware')
const ctrl = require('../../controllers/report.controller')

// GET /reports/sales
router.get('/sales', auth, ctrl.sales)

// GET /reports/clients
router.get('/clients', auth, ctrl.clients)

// GET /reports/export/pdf
router.get('/export/pdf', auth, ctrl.exportPdf)

// GET /reports/export/excel
router.get('/export/excel', auth, ctrl.exportExcel)

module.exports = router

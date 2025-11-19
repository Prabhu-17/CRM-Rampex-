const router = require('express').Router()
const admin = require('../../controllers/admin.controller')

const roleCheck = require('../../middlewares/role.middleware')
const permissionCheck = require('../../middlewares/permission.middleware')

// Only Admin can manage roles & permissions
router.get('/roles', roleCheck(['admin']), admin.roles)
router.post('/roles', roleCheck(['admin']), admin.createRole)
router.patch('/roles/:id', roleCheck(['admin']), admin.updateRole)
router.delete('/roles/:id', roleCheck(['admin']), admin.deleteRole)

router.get('/permissions', roleCheck(['admin']), admin.permissions)

module.exports = router

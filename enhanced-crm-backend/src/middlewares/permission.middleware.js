module.exports = (requiredPermissions = []) => {
  if (typeof requiredPermissions === 'string') {
    requiredPermissions = [requiredPermissions]
  }

  return (req, res, next) => {
    const userRole = req.user?.role
    const userPermissions = req.user?.permissions || []

    // ADMIN BYPASS
    if (userRole === 'admin') {
      return next()
    }

    // normal permission check
    const allowed = requiredPermissions.every((p) =>
      userPermissions.includes(p)
    )

    if (!allowed) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: insufficient permissions',
      })
    }

    next()
  }
}

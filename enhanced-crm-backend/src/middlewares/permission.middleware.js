module.exports = (requiredPermissions = []) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions || []
    const allowed = requiredPermissions.every((p) =>
      userPermissions.includes(p)
    )

    if (!allowed) {
      return res
        .status(403)
        .json({
          success: false,
          message: 'Access denied: insufficient permissions',
        })
    }
    next()
  }
}

module.exports = (allowedTypes = [], maxSizeMB = 5) => {
  return (req, res, next) => {
    if (!req.file) return next()

    const file = req.file
    const maxSize = maxSizeMB * 1024 * 1024

    if (!allowedTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid file type' })
    }

    if (file.size > maxSize) {
      return res
        .status(400)
        .json({
          success: false,
          message: `File too large. Max ${maxSizeMB}MB allowed.`,
        })
    }

    next()
  }
}

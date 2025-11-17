const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage })

exports.uploadMiddleware = upload.single('file')

exports.upload = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' })
    // delegate to a storage service (e.g., s3Service.upload)
    const s3 = require('../services/s3Service')
    const meta = await s3.upload(req.file)
    res.status(201).json(meta)
  } catch (err) {
    next(err)
  }
}

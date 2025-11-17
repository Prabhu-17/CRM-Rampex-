const Activity = require('../models/activity.model')
module.exports = (action) => async (req, res, next) => {
  res.on('finish', async () => {
    try {
      await Activity.create({
        user: req.user?._id,
        action,
        endpoint: req.originalUrl,
        method: req.method,
        status: res.statusCode,
        metadata: req.body,
      })
    } catch (err) {
      console.error('Activity log error:', err)
    }
  })
  next()
}

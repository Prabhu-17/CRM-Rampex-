const Notification = require('../models/Notification')

// GET /notifications
exports.list = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean()

    res.json({
      success: true,
      count: notifications.length,
      data: notifications,
    })
  } catch (err) {
    next(err)
  }
}

// POST /notifications/read-all
exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, seen: false },
      { seen: true }
    )

    res.json({
      success: true,
      message: 'All notifications marked as read',
    })
  } catch (err) {
    next(err)
  }
}

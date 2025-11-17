const jwt = require('jsonwebtoken')
const User = require('../models/User')
const config = require('../config')

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, config.jwtSecret, {
    expiresIn: config.accessExpires,
  })
}

const signRefresh = (user) => {
  return jwt.sign({ id: user._id }, config.jwtRefreshSecret, {
    expiresIn: config.refreshExpires,
  })
}

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body

    const user = await User.create({ name, email, password, role })

    const access = signToken(user)
    const refresh = signRefresh(user)

    // Store refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refresh },
    })

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access,
      refresh,
    })
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' })

    const access = signToken(user)
    const refresh = signRefresh(user)

    // Store refresh token
    await User.findByIdAndUpdate(user._id, {
      $push: { refreshTokens: refresh },
    })

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      access,
      refresh,
    })
  } catch (err) {
    next(err)
  }
}

exports.refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body

    const decoded = jwt.verify(token, config.jwtRefreshSecret)

    const user = await User.findById(decoded.id)
    if (!user) return res.status(401).json({ message: 'Invalid user' })

    // Ensure refresh token still exists
    if (!user.refreshTokens.includes(token)) {
      return res.status(403).json({ message: 'Token invalid or expired' })
    }

    const access = jwt.sign(
      { id: user._id, role: user.role },
      config.jwtSecret,
      { expiresIn: config.accessExpires }
    )

    res.json({ access })
  } catch (err) {
    next(err)
  }
}

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body

    if (!refreshToken)
      return res.status(400).json({ message: 'refreshToken is required' })

    // Decode token → ensure valid
    let decoded
    try {
      decoded = jwt.verify(refreshToken, config.jwtRefreshSecret)
    } catch (err) {
      return res.status(400).json({ message: 'Invalid token' })
    }

    // Remove refresh token from DB
    await User.findByIdAndUpdate(decoded.id, {
      $pull: { refreshTokens: refreshToken },
    })

    res.json({ message: 'Logged out successfully' })
  } catch (err) {
    next(err)
  }
}

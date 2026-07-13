import jwt from 'jsonwebtoken'

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'vrc_super_secret_jwt_key',
    { expiresIn: '15m' }
  )
}

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET || 'vrc_refresh_secret',
    { expiresIn: '7d' }
  )
}

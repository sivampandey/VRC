import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'
import sendWhatsApp from '../utils/sendWhatsApp.js'

const normalizePhone = (phone) => {
  if (!phone) return undefined
  let cleaned = phone.replace(/\D/g, '') // strip non-digits
  if (cleaned.length === 10 && !cleaned.startsWith('91')) {
    cleaned = '91' + cleaned
  }
  return cleaned
}

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body

    const cleanEmail = email && email.trim() ? email.trim() : undefined
    const cleanPhone = phone && phone.trim() ? normalizePhone(phone) : undefined

    if (!cleanEmail && !cleanPhone) {
      return res.status(400).json({ message: 'Either email or phone number is required.' })
    }

    if (cleanEmail) {
      const userExists = await User.findOne({ email: cleanEmail })
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email.' })
      }
    }

    if (cleanPhone) {
      const phoneExists = await User.findOne({ phone: cleanPhone })
      if (phoneExists) {
        return res.status(400).json({ message: 'User already exists with this phone number.' })
      }
    }

    const isAdmin =
      cleanEmail === "vaishnav@admin.com";

    const user = await User.create({
      name,
      email: cleanEmail,
      phone: cleanPhone,
      password,
      isVerified: true,
      role: isAdmin ? "admin" : "user",
    });

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    user.refreshToken = refreshToken
    await user.save()

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      accessToken,
      refreshToken
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body // email field serves as identifier (email or phone)

    if (!email) {
      return res.status(400).json({ message: 'Email or phone number is required.' })
    }

    const identifier = email.trim()
    let user

    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier })
    } else {
      const normalizedPhone = normalizePhone(identifier)
      user = await User.findOne({ phone: normalizedPhone })
    }

    if (user && (await user.matchPassword(password))) {

      const accessToken = generateAccessToken(user)
      const refreshToken = generateRefreshToken(user)

      user.refreshToken = refreshToken
      await user.save()

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        accessToken,
        refreshToken
      })
    } else {
      res.status(401)
      throw new Error('Invalid email, phone number, or password.')
    }
  } catch (error) {
    next(error)
  }
}

export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) return res.status(200).json({ message: 'Logged out successfully.' })

    const user = await User.findOne({ refreshToken })
    if (user) {
      user.refreshToken = undefined
      await user.save()
    }
    return res.status(200).json({ message: 'Logged out successfully.' })
  } catch (error) {
    next(error)
  }
}

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token is required.' })
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'vrc_refresh_secret')
    const user = await User.findOne({ _id: decoded.id, refreshToken })

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token session.' })
    }

    const accessToken = generateAccessToken(user)
    return res.json({ accessToken })
  } catch (error) {
    return res.status(401).json({ message: 'Session expired, please login again.' })
  }
}

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body // serves as identifier (email or phone)
    if (!email) {
      return res.status(400).json({ message: 'Email or phone number is required.' })
    }

    const identifier = email.trim()
    let user

    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier })
    } else {
      const normalizedPhone = normalizePhone(identifier)
      user = await User.findOne({ phone: normalizedPhone })
    }

    if (!user) {
      return res.status(404).json({ message: 'No user exists with this email or phone number.' })
    }

    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp
    user.otpExpires = Date.now() + 10 * 60 * 1000 // expires in 10 minutes
    await user.save()

    let sentEmail = false
    let sentPhone = false

    if (user.email) {
      sentEmail = await sendEmail({
        to: user.email,
        subject: 'Vaishnav Rug Collection - Reset Your Password',
        text: `Your password reset OTP code is: ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your password reset OTP code is:</p><h2>${otp}</h2><p>It is valid for 10 minutes.</p>`
      })
    }

    if (user.phone) {
      sentPhone = await sendWhatsApp({
        to: user.phone,
        message: `Your VRC password reset OTP code is: ${otp}. Valid for 10 minutes.`
      })
    }

    let message = 'Password reset OTP sent.'
    let devOtp = undefined

    if (sentEmail && sentPhone) {
      message = 'Password reset OTP sent to both your email and phone number via WhatsApp.'
    } else if (sentEmail) {
      message = 'Password reset OTP sent to your email.'
    } else if (sentPhone) {
      message = 'Password reset OTP sent to your phone number via WhatsApp.'
    } else {
      message = 'E-mail/WhatsApp configurations are missing/invalid in local environment. Exposing development OTP.'
      devOtp = otp
    }

    return res.json({
      message,
      sentEmail,
      sentPhone,
      devOtp
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req, res, next) => {
  try {
    const { token, otp, identifier, password } = req.body

    let user
    if (otp && identifier) {
      const cleanIdentifier = identifier.trim()
      if (cleanIdentifier.includes('@')) {
        user = await User.findOne({ email: cleanIdentifier })
      } else {
        const normalizedPhone = normalizePhone(cleanIdentifier)
        user = await User.findOne({ phone: normalizedPhone })
      }

      if (!user) {
        return res.status(404).json({ message: 'User not found.' })
      }

      if (!user.otp || user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
        return res.status(400).json({ message: 'Invalid or expired OTP.' })
      }

      user.password = password
      user.otp = undefined
      user.otpExpires = undefined
      await user.save()

      return res.json({ message: 'Password updated successfully!' })
    } else if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'vrc_super_secret_jwt_key')
      user = await User.findById(decoded.id)

      if (!user) {
        return res.status(404).json({ message: 'User session not found.' })
      }

      user.password = password
      await user.save()

      return res.json({ message: 'Password updated successfully!' })
    } else {
      return res.status(400).json({ message: 'Missing token or OTP details.' })
    }
  } catch (error) {
    return res.status(400).json({ message: 'Invalid or expired reset credentials.' })
  }
}

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (user) {
      return res.json(user)
    } else {
      return res.status(404).json({ message: 'User not found.' })
    }
  } catch (error) {
    next(error)
  }
}

export const verifyRegistration = async (req, res, next) => {
  try {
    const { identifier, otp } = req.body
    if (!identifier || !otp) {
      return res.status(400).json({ message: 'Identifier and OTP are required.' })
    }

    const cleanIdentifier = identifier.trim()
    let user
    if (cleanIdentifier.includes('@')) {
      user = await User.findOne({ email: cleanIdentifier })
    } else {
      const normalizedPhone = normalizePhone(cleanIdentifier)
      user = await User.findOne({ phone: normalizedPhone })
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    if (!user.otp || user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' })
    }

    user.isVerified = true
    user.otp = undefined
    user.otpExpires = undefined

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)
    user.refreshToken = refreshToken
    await user.save()

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: true,
      accessToken,
      refreshToken
    })
  } catch (error) {
    next(error)
  }
}

export const resendOTP = async (req, res, next) => {
  try {
    const { identifier } = req.body
    if (!identifier) {
      return res.status(400).json({ message: 'Identifier is required.' })
    }

    const cleanIdentifier = identifier.trim()
    let user
    if (cleanIdentifier.includes('@')) {
      user = await User.findOne({ email: cleanIdentifier })
    } else {
      const normalizedPhone = normalizePhone(cleanIdentifier)
      user = await User.findOne({ phone: normalizedPhone })
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    user.otp = otp
    user.otpExpires = Date.now() + 10 * 60 * 1000
    await user.save()

    let sentEmail = false
    let sentPhone = false

    if (user.email) {
      sentEmail = await sendEmail({
        to: user.email,
        subject: 'Vaishnav Rug Collection - Verification Code',
        text: `Your verification OTP code is: ${otp}. It is valid for 10 minutes.`,
        html: `<p>Your verification OTP code is:</p><h2>${otp}</h2><p>It is valid for 10 minutes.</p>`
      })
    }

    if (user.phone) {
      sentPhone = await sendWhatsApp({
        to: user.phone,
        message: `Your VRC verification OTP code is: ${otp}. Valid for 10 minutes.`
      })
    }

    return res.json({
      message: 'OTP resent successfully.',
      sentEmail,
      sentPhone
    })
  } catch (error) {
    next(error)
  }
}

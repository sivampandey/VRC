import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js'
import sendEmail from '../utils/sendEmail.js'
import sendWhatsApp from '../utils/sendWhatsApp.js'
import dns from 'dns'

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
      // 1. Regex format check
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({ message: 'Please enter a valid email address structure.' })
      }

      // 2. DNS check to ensure domain exists and has mail MX/A records
      const domain = cleanEmail.split('@')[1]
      const isValidDomain = await new Promise((resolve) => {
        dns.resolveMx(domain, (err, addresses) => {
          if (err || !addresses || addresses.length === 0) {
            dns.resolve(domain, (err2, records) => {
              resolve(!err2 && records && records.length > 0)
            })
          } else {
            resolve(true)
          }
        })
      })

      if (!isValidDomain) {
        return res.status(400).json({ message: 'The email domain does not exist or cannot receive mail.' })
      }

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

    // Send congratulations / welcome email
    if (user.email) {
      sendEmail({
        to: user.email,
        subject: '🎉 Congratulations! Your VRC Account is Created',
        text: `Dear ${user.name},\n\nCongratulations! Your account at Vaishnav Rug Collection has been successfully created.\n\nExplore our hand-woven rugs at ${process.env.CLIENT_URL || 'http://localhost:5173'}.\n\nBest regards,\nVaishnav Rug Collection`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0dcd3; background-color: #FAF9F6;">
            <div style="background-color: #160400; padding: 20px; text-align: center; border-bottom: 2px solid #C9A56A;">
              <h2 style="color: #FAF5F0; margin: 0; font-family: Georgia, serif; letter-spacing: 0.1em;">VAISHNAV RUG COLLECTION</h2>
            </div>
            <div style="padding: 20px; color: #333333;">
              <h3 style="color: #160400;">Dear ${user.name},</h3>
              <p style="font-size: 14px;"><strong>Congratulations!</strong> Your account has been successfully created.</p>
              <p style="font-size: 14px;">Explore our signature range of premium hand-woven, custom, and bespoke luxury rugs. Discover rugs designed by master weavers that bring timeless art to your living space.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}" style="background-color: #C9A56A; color: #160400; padding: 12px 30px; text-decoration: none; font-weight: bold; font-size: 12px; letter-spacing: 0.15em; font-family: sans-serif; display: inline-block;">EXPLORE THE GALLERY</a>
              </div>
              <p style="font-size: 12px; color: #777777;">If you have any inquiries or bespoke customization requirements, feel free to contact us or send us a WhatsApp message directly from the website.</p>
            </div>
            <div style="background-color: #100301; padding: 15px; text-align: center; font-size: 11px; color: #a19a90; border-top: 1px solid #C9A56A/30;">
              &copy; ${new Date().getFullYear()} Vaishnav Rug Collection. All rights reserved.
            </div>
          </div>
        `
      }).then(sent => {
        if (sent) console.log(`[Email] Congratulations email sent to registered user: ${user.email}`)
      })
    }

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

import express from 'express'
import { register, login, logout, refresh, forgotPassword, resetPassword, getMe, verifyRegistration, resendOTP } from '../controllers/authController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', logout)
router.post('/refresh', refresh)
router.post('/forgot-password', forgotPassword)
router.post('/reset-password', resetPassword)
router.post('/verify-registration', verifyRegistration)
router.post('/resend-otp', resendOTP)
router.get('/me', protect, getMe)

export default router

import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useNavigate } from 'react-router-dom'
import { useForgotPasswordMutation, useResetPasswordMutation } from '../../store/api/authApi'
import toast from 'react-hot-toast'
import Button from '../../components/ui/Button'
import ScrollReveal from '../../components/ui/ScrollReveal'
import authBgImg from '../../assets/auth_bg.png'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1 = request OTP, 2 = verify OTP & reset
  const [identifier, setIdentifier] = useState('')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [devOtp, setDevOtp] = useState('')

  const [forgotPassword, { isLoading: isRequestingOTP }] = useForgotPasswordMutation()
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation()

  const handleRequestOTP = async (e) => {
    e.preventDefault()
    if (!identifier.trim()) {
      return toast.error('Please enter your email or phone number.')
    }

    const loadingToast = toast.loading('Sending verification code...')
    try {
      const response = await forgotPassword({ email: identifier.trim() }).unwrap()
      toast.dismiss(loadingToast)
      toast.success(response.message || 'OTP code sent successfully!')
      if (response.devOtp) {
        setDevOtp(response.devOtp)
      } else {
        setDevOtp('')
      }
      setStep(2)
    } catch (err) {
      toast.dismiss(loadingToast)
      console.error(err)
      toast.error(err.data?.message || 'Failed to send OTP code. Please try again.')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!otp.trim() || otp.trim().length !== 6) {
      return toast.error('Please enter a valid 6-digit OTP code.')
    }
    if (!newPassword.trim() || newPassword.trim().length < 6) {
      return toast.error('Password must be at least 6 characters long.')
    }

    const loadingToast = toast.loading('Updating password...')
    try {
      const response = await resetPassword({
        identifier: identifier.trim(),
        otp: otp.trim(),
        password: newPassword.trim()
      }).unwrap()
      toast.dismiss(loadingToast)
      toast.success(response.message || 'Password reset successful!')
      navigate('/login')
    } catch (err) {
      toast.dismiss(loadingToast)
      console.error(err)
      toast.error(err.data?.message || 'Failed to reset password. Verify the OTP and try again.')
    }
  }

  return (
    <>
      <Helmet>
        <title>Forgot Password | Vaishnav Rug Collection</title>
        <meta name="description" content="Reset your password using an OTP sent to your Email or Phone Number." />
      </Helmet>

      {/* Whole screen background layout */}
      <div className="relative min-h-screen flex items-center justify-center py-20 px-4 font-jost text-left overflow-hidden">
        
        {/* Full Screen Background Image */}
        <img 
          src={authBgImg} 
          alt="Luxurious detailed handcrafted wool carpet background" 
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        {/* Deep elegant overlay wash */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#290509]/85 via-[#160400]/70 to-[#290509]/80 pointer-events-none" />
        
        {/* Centered Forgot Password Card */}
        <div className="relative z-10 w-full max-w-sm">
          <ScrollReveal direction="up">
            <div className="bg-white/12 backdrop-blur-xl border border-white/15 p-6 md:p-8 space-y-4 shadow-2xl rounded-sm text-white">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
                <Link to="/login" className="text-white/60 hover:text-white transition-colors duration-200">
                  <ArrowLeft size={16} />
                </Link>
                <div className="text-right">
                  <span className="block font-cinzel text-[8px] tracking-[0.2em] text-[#C9A56A] uppercase font-bold">Security Portal</span>
                  <h2 className="font-cormorant text-lg text-white font-bold leading-tight">Recover Password</h2>
                </div>
              </div>

              {step === 1 ? (
                // STEP 1: Enter email or phone to get OTP
                <form onSubmit={handleRequestOTP} className="space-y-4">
                  <p className="text-[11px] text-white/70 leading-relaxed font-sans">
                    Enter the Email Address or Phone Number associated with your account. We will send you a 6-digit verification code (OTP).
                  </p>
                  <div>
                    <label className="block text-[9px] uppercase font-cinzel font-bold text-white/80 mb-1">Email or Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. user@example.com or 918707630603"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 p-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A56A] focus:bg-white/10 rounded-sm"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-2.5 uppercase font-bold text-xs tracking-wider"
                    disabled={isRequestingOTP}
                  >
                    {isRequestingOTP ? 'Sending OTP...' : 'Send Verification OTP'}
                  </Button>
                </form>
              ) : (
                // STEP 2: Enter OTP and New Password
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <p className="text-[11px] text-white/75 leading-relaxed font-sans">
                    A 6-digit OTP code has been dispatched. Enter it below along with your new password.
                  </p>
                  {devOtp && (
                    <div className="bg-[#C9A56A]/20 border border-[#C9A56A]/40 p-3 rounded-sm text-[10px] text-amber-100 font-sans space-y-1">
                      <span className="font-bold block uppercase tracking-wider text-[8px] text-[#C9A56A]">Dev Mode Notification</span>
                      <p>SMTP / WhatsApp are not configured. Your OTP is:</p>
                      <div className="text-center font-mono font-bold text-sm tracking-widest bg-black/40 py-1 text-white select-all">{devOtp}</div>
                    </div>
                  )}
                  <div>
                    <label className="block text-[9px] uppercase font-cinzel font-bold text-white/80 mb-1">Verification OTP Code</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit code"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white/5 border border-white/15 p-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A56A] focus:bg-white/10 rounded-sm tracking-[0.2em] text-center font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] uppercase font-cinzel font-bold text-white/80 mb-1">New Password</label>
                    <input
                      type="password"
                      required
                      placeholder="At least 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/15 p-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A56A] focus:bg-white/10 rounded-sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="w-1/3 py-2.5 uppercase font-bold text-[10px] tracking-wider border-white/15 text-white/70 hover:text-white"
                      disabled={isResettingPassword}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-2/3 py-2.5 uppercase font-bold text-xs tracking-wider"
                      disabled={isResettingPassword}
                    >
                      {isResettingPassword ? 'Updating...' : 'Reset Password'}
                    </Button>
                  </div>
                </form>
              )}

              <div className="text-center text-[10px] text-white/60 pt-2 border-t border-white/10 flex justify-between items-center">
                <Link to="/login" className="text-white hover:text-[#C9A56A] transition-colors duration-200 flex items-center gap-1">
                  Back to Sign In
                </Link>
                <Link to="/register" className="text-[#C9A56A] font-semibold hover:text-white underline">
                  Register Account
                </Link>
              </div>

            </div>
          </ScrollReveal>
        </div>

      </div>
    </>
  )
}

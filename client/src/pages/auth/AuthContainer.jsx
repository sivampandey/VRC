import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  Globe,
  Award,
  ChevronRight,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { loginSchema, registerSchema } from './authSchema'

export default function AuthContainer({
  isRegisterInitial = false,
  onLoginSubmit,
  onRegisterSubmit,
  isLoadingLogin = false,
  isLoadingRegister = false,
  handleGoogleSignIn,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  // Tab determination based on URL path or initial state
  const activeTab = location.pathname.includes('/register') ? 'register' : 'login'

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Registration sign up method toggle: 'email' or 'phone'
  const [signUpMethod, setSignUpMethod] = useState('email')

  // Redirection parameter
  const redirectTo = new URLSearchParams(location.search).get('redirect') || '/'

  // 1. Login Form Setup
  const {
    register: loginRegister,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors, isSubmitting: isSubmittingLogin },
    reset: resetLoginForm
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', rememberMe: false }
  })

  // 2. Register Form Setup
  const {
    register: registerRegister,
    handleSubmit: handleRegisterSubmit,
    formState: { errors: registerErrors, isSubmitting: isSubmittingRegister },
    watch: registerWatch,
    setValue: registerSetValue,
    reset: resetRegisterForm
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      signUpMethod: 'email',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    }
  })

  // Synchronize Zod registration sign up method field with our state toggle
  useEffect(() => {
    registerSetValue('signUpMethod', signUpMethod)
  }, [signUpMethod, registerSetValue])

  // Watch password for strength meter
  const watchedPassword = registerWatch('password') || ''

  // Watch sign up method for forms validation conditional styles
  const watchedSignUpMethod = registerWatch('signUpMethod') || 'email'

  // Tab switching
  const handleTabToggle = (tab) => {
    if (tab === 'login') {
      navigate('/login' + location.search)
      resetLoginForm()
    } else {
      navigate('/register' + location.search)
      resetRegisterForm()
    }
  }

  // Password strength calculation helper (score 0-5)
  const getPasswordStrength = (pass) => {
    if (!pass) return 0
    let score = 0
    if (pass.length >= 8) score++
    if (/[a-z]/.test(pass)) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[0-9]/.test(pass)) score++
    if (/[^A-Za-z0-9]/.test(pass)) score++
    return score
  }

  const pwdStrength = getPasswordStrength(watchedPassword)

  // Password strength helper configurations
  const getStrengthLabel = (score) => {
    if (score === 0) return { label: 'None', color: 'bg-white/10', text: 'text-white/40' }
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500', text: 'text-[#FF6B6B]' }
    if (score === 3) return { label: 'Medium', color: 'bg-yellow-500', text: 'text-[#D4AF37]' }
    return { label: 'Strong', color: 'bg-emerald-500', text: 'text-[#52D273]' }
  }

  // Background particles animation values
  const [particles] = useState(() =>
    Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 3 + 1.5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 15 + 15,
      delay: Math.random() * -20,
    }))
  )

  // Submissions
  const onSubmitLogin = async (data) => {
    await onLoginSubmit(data)
  }

  const onSubmitRegister = async (data) => {
    await onRegisterSubmit(data)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen w-full bg-[#0a0102] flex items-center justify-center font-manrope text-white py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto"
    >
      {/* Luxury Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0102] via-[#240409] to-[#140103] opacity-98 z-0 pointer-events-none" />

      {/* Soft spotlight behind auth card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,rgba(37,4,8,0)_70%)] blur-[120px] pointer-events-none z-0" />

      {/* Blurred decorative luxury elements */}
      <motion.div
        animate={{
          x: [0, 20, -10, 0],
          y: [0, -30, 15, 0],
          scale: [1, 1.05, 0.98, 1]
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
        className="absolute -top-32 -left-32 w-[350px] h-[350px] rounded-full bg-gradient-to-br from-[#D4AF37]/5 to-[#F6D365]/2 blur-[100px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          x: [0, -25, 20, 0],
          y: [0, 25, -20, 0],
          scale: [1, 0.98, 1.02, 1]
        }}
        transition={{ repeat: Infinity, duration: 24, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-[#240409]/40 to-[#D4AF37]/3 blur-[120px] pointer-events-none z-0"
      />

      {/* Subtle Noise Texture Overlay */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-overlay z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Rising luxury gold floating particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37]/20 pointer-events-none z-0"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: ['0vh', '-100vh'],
            x: ['0vw', `${(Math.random() - 0.5) * 6}vw`],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'linear',
          }}
        />
      ))}

      {/* Main Grid Wrapper */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-8 lg:gap-16 items-center">

        {/* Left Column (Luxury branding area) */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-10 text-left px-6">
          {/* Typographic Logo */}
          <div className="flex flex-col space-y-2 select-none">
            <div className="flex items-center gap-3">
              <span className="font-cinzel text-3xl tracking-[0.3em] text-[#D4AF37] font-semibold">V R C</span>
              <div className="h-5 w-[1px] bg-white/20" />
              <span className="font-cinzel text-[8.5px] tracking-[0.4em] text-white/40 uppercase font-medium">Est. 2024</span>
            </div>
            <span className="font-cinzel text-[9px] tracking-[0.45em] text-white/50 uppercase font-semibold">
              Vaishnav Rug Collection
            </span>
            <div className="w-20 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent mt-1" />
          </div>

          <div className="space-y-4">
            <h1 className="font-cormorant text-4xl xl:text-5xl font-light leading-[1.2] text-white">
              Step into the world of <span className="italic font-normal text-[#D4AF37]">Exquisite Handcrafted</span> luxury
            </h1>
            <p className="text-white/60 text-sm font-light tracking-wide max-w-md leading-relaxed font-inter">
              Join an exclusive guild of custom weavers, designers, and heritage caretakers. Access your bespoke orders, track artisanal weaving milestones, and explore our master collections.
            </p>
          </div>

          {/* Luxury Feature Cards */}
          <div className="space-y-4">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.2)' }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] shrink-0">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinzel text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold mb-1">Generational Craft</h3>
                <p className="text-white/40 text-xs font-light font-inter leading-relaxed">Each masterpiece is hand-knotted by generational artisans in Bhadohi, India.</p>
              </div>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.2)' }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinzel text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold mb-1">Bespoke Commissioning</h3>
                <p className="text-white/40 text-xs font-light font-inter leading-relaxed">Customize dimensions, material blends (wool/silk), and dye lots with ease.</p>
              </div>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.2)' }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.01] border border-white/[0.04] transition-all duration-300"
            >
              <div className="p-2.5 rounded-lg bg-[#D4AF37]/10 text-[#D4AF37] shrink-0">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-cinzel text-[10px] tracking-widest text-[#D4AF37] uppercase font-bold mb-1">Global White-Glove Care</h3>
                <p className="text-white/40 text-xs font-light font-inter leading-relaxed">Fully insured priority courier service directly from our looms to your domain.</p>
              </div>
            </motion.div>
          </div>

          <div className="text-[9px] font-cinzel text-white/30 tracking-[0.25em] pt-4">
            WOVEN WITH TRADITION · MADE FOR GENERATIONS
          </div>
        </div>

        {/* Right Column (Glass Auth Card) */}
        <div className="lg:col-span-6 flex flex-col justify-center items-center w-full">

          {/* Mobile Logo Header */}
          <div className="flex lg:hidden flex-col items-center space-y-1 mb-8 text-center select-none">
            <span className="font-cinzel text-2xl tracking-[0.3em] text-[#D4AF37] font-bold">V R C</span>
            <span className="font-cinzel text-[8px] tracking-[0.35em] text-white/50 uppercase font-semibold">
              Vaishnav Rug Collection
            </span>
          </div>

          {/* Glass Authentication Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
            className="w-full max-w-[460px] backdrop-blur-[30px] bg-white/[0.03] border border-white/[0.08] rounded-[24px] p-5 xs:p-7 sm:p-9 shadow-[0_30px_70px_rgba(0,0,0,0.5),0_0_50px_rgba(212,175,55,0.01)] relative overflow-hidden transition-all duration-500 hover:border-white/[0.12]"
          >
            {/* Elegant upper glow border decoration */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent pointer-events-none" />

            {/* Pill-Style Login / Register Tab Switcher */}
            <div className="relative flex justify-center bg-[#0d0103]/60 border border-white/[0.06] rounded-full p-1 mb-8 max-w-[300px] mx-auto select-none">
              <button
                type="button"
                onClick={() => handleTabToggle('login')}
                className={`flex-1 py-1.5 font-cinzel text-[10px] tracking-widest uppercase font-bold rounded-full transition-all duration-300 relative ${activeTab === 'login' ? 'text-[#1e0306] font-extrabold' : 'text-white/40 hover:text-white'}`}
              >
                {activeTab === 'login' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F6D365] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabToggle('register')}
                className={`flex-1 py-1.5 font-cinzel text-[10px] tracking-widest uppercase font-bold rounded-full transition-all duration-300 relative ${activeTab === 'register' ? 'text-[#1e0306] font-extrabold' : 'text-white/40 hover:text-white'}`}
              >
                {activeTab === 'register' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F6D365] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">Register</span>
              </button>
            </div>

            {/* Forms Section with AnimatePresence for smooth sliding/switching */}
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-5 text-left"
                >
                  {/* Header text */}
                  <div>
                    <h2 className="font-cormorant text-2xl font-light text-white tracking-wide">Welcome Back</h2>
                    <p className="text-white/40 text-xs font-light mt-1 font-inter">
                      Please enter your credentials to access your luxury rugs portal.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit(onSubmitLogin)} className="space-y-4">
                    {/* Email / Username field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3.5 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        {...loginRegister('email')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/40 border border-white/[0.08] rounded-xl pl-11 pr-4 pt-5 pb-2 text-base md:text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-3.5 placeholder-shown:pb-3.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-11 top-1.5 text-[8px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px] peer-focus:text-[#D4AF37]">
                        Email or Phone Number
                      </label>
                      {loginErrors.email && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[10px] mt-1 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {loginErrors.email.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Password field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3.5 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...loginRegister('password')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/40 border border-white/[0.08] rounded-xl pl-11 pr-11 pt-5 pb-2 text-base md:text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-3.5 placeholder-shown:pb-3.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-11 top-1.5 text-[8px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px] peer-focus:text-[#D4AF37]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {loginErrors.password && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[10px] mt-1 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {loginErrors.password.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Remember me & forgot password */}
                    <div className="flex justify-between items-center text-xs font-inter text-white/50 select-none px-0.5 pt-1">
                      <label className="flex items-center space-x-2.5 cursor-pointer hover:text-white transition-colors duration-200">
                        <input
                          type="checkbox"
                          {...loginRegister('rememberMe')}
                          className="w-3.5 h-3.5 accent-[#D4AF37] bg-white/5 border border-white/10 rounded focus:ring-0 cursor-pointer"
                        />
                        <span className="font-light">Remember me</span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[#D4AF37] hover:text-[#F6D365] hover:underline uppercase tracking-wider font-semibold text-[9px] font-cinzel"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Login Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoadingLogin || isSubmittingLogin}
                      whileHover={{ scale: 1.015, boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full relative overflow-hidden h-11 bg-gradient-to-r from-[#D4AF37] via-[#F6D365] to-[#D4AF37] text-[#1a0204] rounded-xl font-cinzel text-xs font-extrabold tracking-widest uppercase cursor-pointer transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center shadow-md mt-6"
                    >
                      {isLoadingLogin || isSubmittingLogin ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#1e0306]" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          Sign In <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-4 text-left"
                >
                  {/* Header text */}
                  <div>
                    <h2 className="font-cormorant text-2xl font-light text-white tracking-wide">Create Your Account</h2>
                    <p className="text-white/40 text-xs font-light mt-1 font-inter">
                      Begin your bespoke rug journey and create a collector profile.
                    </p>
                  </div>

                  {/* Toggle registration mode: Email vs Phone */}
                  <div className="flex border-b border-white/[0.08] pb-2 justify-start gap-4 text-[9px] font-bold font-cinzel select-none">
                    <button
                      type="button"
                      onClick={() => setSignUpMethod('email')}
                      className={`pb-1 uppercase tracking-widest transition-all duration-300 border-b ${signUpMethod === 'email'
                        ? 'text-[#D4AF37] border-[#D4AF37]'
                        : 'text-white/30 border-transparent hover:text-white/60'
                        }`}
                    >
                      Register with Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignUpMethod('phone')}
                      className={`pb-1 uppercase tracking-widest transition-all duration-300 border-b ${signUpMethod === 'phone'
                        ? 'text-[#D4AF37] border-[#D4AF37]'
                        : 'text-white/30 border-transparent hover:text-white/60'
                        }`}
                    >
                      Register with Phone
                    </button>
                  </div>

                  <form onSubmit={handleRegisterSubmit(onSubmitRegister)} className="space-y-3">
                    {/* Name input */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3.5 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        {...registerRegister('name')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/40 border border-white/[0.08] rounded-xl pl-11 pr-4 pt-5 pb-2 text-base md:text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-3.5 placeholder-shown:pb-3.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-11 top-1.5 text-[8px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px] peer-focus:text-[#D4AF37]">
                        Full Name
                      </label>
                      {registerErrors.name && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[10px] mt-0.5 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {registerErrors.name.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Conditional Email field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3.5 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        {...registerRegister('email')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/40 border border-white/[0.08] rounded-xl pl-11 pr-4 pt-5 pb-2 text-base md:text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-3.5 placeholder-shown:pb-3.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-11 top-1.5 text-[8px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px] peer-focus:text-[#D4AF37]">
                        Email Address {signUpMethod === 'phone' && '(Optional)'}
                      </label>
                      {registerErrors.email && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[10px] mt-0.5 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {registerErrors.email.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Conditional Phone field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3.5 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        {...registerRegister('phone')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/40 border border-white/[0.08] rounded-xl pl-11 pr-4 pt-5 pb-2 text-base md:text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-3.5 placeholder-shown:pb-3.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-11 top-1.5 text-[8px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px] peer-focus:text-[#D4AF37]">
                        Phone Number {signUpMethod === 'email' && '(Optional)'}
                      </label>
                      {registerErrors.phone && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[10px] mt-0.5 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {registerErrors.phone.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Password field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3.5 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...registerRegister('password')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/40 border border-white/[0.08] rounded-xl pl-11 pr-11 pt-5 pb-2 text-base md:text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-3.5 placeholder-shown:pb-3.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-11 top-1.5 text-[8px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px] peer-focus:text-[#D4AF37]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {registerErrors.password && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[10px] mt-0.5 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {registerErrors.password.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Password Strength Meter */}
                    {watchedPassword.length > 0 && (
                      <div className="space-y-1.5 px-0.5 font-inter">
                        <div className="flex justify-between items-center text-[9px] uppercase font-bold tracking-wider">
                          <span className="text-white/40">Strength:</span>
                          <span className={`${getStrengthLabel(pwdStrength).text}`}>
                            {getStrengthLabel(pwdStrength).label}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1 h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: i < pwdStrength ? 1 : 0 }}
                              className={`h-full rounded-full origin-left ${pwdStrength <= 2
                                ? 'bg-[#FF6B6B]'
                                : pwdStrength === 3
                                  ? 'bg-[#D4AF37]'
                                  : 'bg-[#52D273]'
                                }`}
                              transition={{ duration: 0.3 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Confirm Password field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3.5 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...registerRegister('confirmPassword')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/40 border border-white/[0.08] rounded-xl pl-11 pr-11 pt-5 pb-2 text-base md:text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-3.5 placeholder-shown:pb-3.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-11 top-1.5 text-[8px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-xs peer-placeholder-shown:top-3.5 peer-focus:top-1.5 peer-focus:text-[8px] peer-focus:text-[#D4AF37]">
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {registerErrors.confirmPassword && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[10px] mt-0.5 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {registerErrors.confirmPassword.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Accept Terms Checkbox */}
                    <div className="space-y-1 px-0.5 pt-1">
                      <label className="flex items-start space-x-2.5 cursor-pointer hover:text-white text-[11px] font-inter text-white/50 select-none">
                        <input
                          type="checkbox"
                          {...registerRegister('acceptTerms')}
                          className="w-3.5 h-3.5 accent-[#D4AF37] bg-white/5 border border-white/10 rounded focus:ring-0 cursor-pointer mt-0.5 shrink-0"
                        />
                        <span className="font-light leading-snug">
                          I accept the <a href="/terms" className="text-[#D4AF37] hover:underline font-semibold">Terms of Service</a> & <a href="/privacy" className="text-[#D4AF37] hover:underline font-semibold">Privacy Policy</a>
                        </span>
                      </label>
                      {registerErrors.acceptTerms && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[10px] font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {registerErrors.acceptTerms.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Register Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoadingRegister || isSubmittingRegister}
                      whileHover={{ scale: 1.015, boxShadow: '0 4px 20px rgba(212,175,55,0.25)' }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full relative overflow-hidden h-11 bg-gradient-to-r from-[#D4AF37] via-[#F6D365] to-[#D4AF37] text-[#1a0204] rounded-xl font-cinzel text-xs font-extrabold tracking-widest uppercase cursor-pointer transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center shadow-md mt-6"
                    >
                      {isLoadingRegister || isSubmittingRegister ? (
                        <Loader2 className="w-4 h-4 animate-spin text-[#1e0306]" />
                      ) : (
                        <span className="flex items-center gap-1.5">
                          Create Account <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Logins Divider */}
            <div className="relative flex items-center justify-center py-4 my-2 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]"></div>
              </div>
              <span className="relative px-3.5 bg-[#0a0102] text-white/35 text-[9px] font-cinzel font-bold tracking-[0.15em] uppercase">or continue with</span>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Google login button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="h-10 border border-white/[0.06] bg-[#0d0103]/40 hover:bg-white/[0.04] text-white/80 hover:text-white font-cinzel font-bold text-[9px] tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 rounded-xl hover:border-white/15 select-none cursor-pointer"
              >
                {/* Google Icon SVG */}
                <svg className="shrink-0 w-3.5 h-3.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.2-5.136 4.2a6.45 6.45 0 0 1-6.45-6.45c0-3.563 2.887-6.45 6.45-6.45 1.637 0 3.129.607 4.28 1.606l3.09-3.09A10.82 10.82 0 0 0 12.24 1.1c-6.07 0-11 4.93-11 11s4.93 11 11 11c5.96 0 10.89-4.81 10.89-11 0-.693-.06-1.393-.19-2.073H12.24Z"
                  />
                </svg>
                GOOGLE
              </button>

              {/* Apple login button */}
              <button
                type="button"
                onClick={() => {
                  toast.loading('Connecting with Apple ID...', { duration: 1500 })
                  setTimeout(() => {
                    toast.success('Successfully authenticated with Apple ID!')
                  }, 1600)
                }}
                className="h-10 border border-white/[0.06] bg-[#0d0103]/40 hover:bg-white/[0.04] text-white/80 hover:text-white font-cinzel font-bold text-[9px] tracking-widest flex items-center justify-center gap-2.5 transition-all duration-300 rounded-xl hover:border-white/15 select-none cursor-pointer"
              >
                {/* Apple Icon SVG */}
                <svg className="shrink-0 w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.5-.61.7-1.15 1.84-1.01 2.96 1.12.09 2.28-.59 2.94-1.4z" />
                </svg>
                APPLE
              </button>
            </div>

            {/* Footnote details */}
            <div className="mt-8 text-center text-[10px] text-white/35 font-inter space-y-1.5 select-none">
              <p>Secure 256-bit SSL encrypted connection.</p>
              <div className="flex justify-center space-x-3 text-white/40">
                <a href="/terms" className="hover:text-white hover:underline transition-colors">Terms</a>
                <span>•</span>
                <a href="/privacy" className="hover:text-white hover:underline transition-colors">Privacy</a>
                <span>•</span>
                <a href="/contact" className="hover:text-white hover:underline transition-colors">Support</a>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  )
}

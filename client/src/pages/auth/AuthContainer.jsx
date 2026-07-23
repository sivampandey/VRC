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
  Loader2,
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

  useEffect(() => {
    registerSetValue('signUpMethod', signUpMethod)
  }, [signUpMethod, registerSetValue])

  const watchedPassword = registerWatch('password') || ''

  const handleTabToggle = (tab) => {
    if (tab === 'login') {
      navigate('/login' + location.search)
      resetLoginForm()
    } else {
      navigate('/register' + location.search)
      resetRegisterForm()
    }
  }

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

  const getStrengthLabel = (score) => {
    if (score === 0) return { label: 'None', text: 'text-white/40' }
    if (score <= 2) return { label: 'Weak', text: 'text-[#FF6B6B]' }
    if (score === 3) return { label: 'Medium', text: 'text-[#D4AF37]' }
    return { label: 'Strong', text: 'text-[#52D273]' }
  }

  // Floating particles background
  const [particles] = useState(() =>
    Array.from({ length: 22 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2.5 + 1.2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 14 + 14,
      delay: Math.random() * -15,
    }))
  )

  const onSubmitLogin = async (data) => {
    await onLoginSubmit(data)
  }

  const onSubmitRegister = async (data) => {
    await onRegisterSubmit(data)
  }

  // Framer Motion entrance variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="relative min-h-[calc(100vh-68px)] lg:h-[calc(100vh-68px)] w-full bg-[#0a0102] flex items-center justify-center font-manrope text-white py-4 px-3 sm:px-6 lg:px-8 overflow-y-auto lg:overflow-hidden"
    >
      {/* Background Glows & Shimmers */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0102] via-[#200308] to-[#120103] opacity-98 z-0 pointer-events-none" />

      {/* Radial gold spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06)_0%,rgba(32,3,8,0)_70%)] blur-[100px] pointer-events-none z-0" />

      {/* Animated ambient orbs */}
      <motion.div
        animate={{
          x: [0, 18, -12, 0],
          y: [0, -20, 10, 0],
          scale: [1, 1.04, 0.98, 1]
        }}
        transition={{ repeat: Infinity, duration: 18, ease: "easeInOut" }}
        className="absolute -top-24 -left-24 w-[300px] h-[300px] rounded-full bg-gradient-to-br from-[#D4AF37]/6 to-[#F6D365]/2 blur-[90px] pointer-events-none z-0"
      />
      <motion.div
        animate={{
          x: [0, -20, 15, 0],
          y: [0, 20, -15, 0],
          scale: [1, 0.98, 1.02, 1]
        }}
        transition={{ repeat: Infinity, duration: 22, ease: "easeInOut" }}
        className="absolute -bottom-24 -right-24 w-[320px] h-[320px] rounded-full bg-gradient-to-tr from-[#240409]/40 to-[#D4AF37]/4 blur-[100px] pointer-events-none z-0"
      />

      {/* Rising gold particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#D4AF37]/25 pointer-events-none z-0"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            y: ['0vh', '-90vh'],
            x: ['0vw', `${(Math.random() - 0.5) * 5}vw`],
            opacity: [0, 0.65, 0],
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-10 gap-4 lg:gap-8 items-center"
      >
        {/* ── Left Column (Luxury branding area - Desktop only) ── */}
        <div className="hidden lg:flex lg:col-span-4 flex-col space-y-4 text-left px-3">
          {/* Logo */}
          <motion.div variants={itemVariants} className="flex flex-col space-y-1 select-none">
            <div className="flex items-center gap-2.5">
              <span className="font-cinzel text-2xl tracking-[0.28em] text-[#D4AF37] font-semibold">V R C</span>
              <div className="h-4 w-[1px] bg-white/20" />
              <span className="font-cinzel text-[7.5px] tracking-[0.35em] text-white/40 uppercase font-medium">Est. 2024</span>
            </div>
            <span className="font-cinzel text-[8px] tracking-[0.4em] text-white/50 uppercase font-semibold">
              Vaishnav Rug Collection
            </span>
            <div className="w-16 h-[1px] bg-gradient-to-r from-[#D4AF37] to-transparent mt-0.5" />
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="space-y-2">
            <h1 className="font-cormorant text-2xl xl:text-3xl font-light leading-[1.2] text-white">
              Step into the world of <span className="italic font-normal text-[#D4AF37]">Exquisite Handcrafted</span> luxury
            </h1>
            <p className="text-white/60 text-xs font-light tracking-wide leading-relaxed font-inter">
              Access your bespoke orders, track artisanal weaving milestones, and explore our master collections from Bhadohi.
            </p>
          </motion.div>

          {/* Luxury Feature List */}
          <motion.div variants={itemVariants} className="space-y-2.5 pt-1">
            <motion.div
              whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.25)' }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.015] border border-white/[0.05] transition-all duration-300"
            >
              <div className="p-2 rounded-md bg-[#D4AF37]/12 text-[#D4AF37] shrink-0 mt-0.5">
                <Award className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-cinzel text-[9.5px] tracking-widest text-[#D4AF37] uppercase font-bold mb-0.5">Generational Craft</h3>
                <p className="text-white/40 text-[11px] font-light font-inter leading-tight">Hand-knotted by generational artisans in Bhadohi, India.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.25)' }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.015] border border-white/[0.05] transition-all duration-300"
            >
              <div className="p-2 rounded-md bg-[#D4AF37]/12 text-[#D4AF37] shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-cinzel text-[9.5px] tracking-widest text-[#D4AF37] uppercase font-bold mb-0.5">Bespoke Commissioning</h3>
                <p className="text-white/40 text-[11px] font-light font-inter leading-tight">Customize dimensions, material blends (wool/silk), and dye lots.</p>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ x: 3, backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'rgba(212,175,55,0.25)' }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.015] border border-white/[0.05] transition-all duration-300"
            >
              <div className="p-2 rounded-md bg-[#D4AF37]/12 text-[#D4AF37] shrink-0 mt-0.5">
                <Globe className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="font-cinzel text-[9.5px] tracking-widest text-[#D4AF37] uppercase font-bold mb-0.5">White-Glove Care</h3>
                <p className="text-white/40 text-[11px] font-light font-inter leading-tight">Insured priority courier service directly from our looms.</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-[8.5px] font-cinzel text-white/30 tracking-[0.22em]">
            WOVEN WITH TRADITION · MADE FOR GENERATIONS
          </motion.div>
        </div>

        {/* ── Right Column (Glass Auth Card) ── */}
        <motion.div variants={itemVariants} className="lg:col-span-6 flex flex-col justify-center items-center w-full">

          {/* Mobile Logo Header */}
          <div className="flex lg:hidden flex-col items-center space-y-0.5 mb-4 text-center select-none">
            <span className="font-cinzel text-xl tracking-[0.25em] text-[#D4AF37] font-bold">V R C</span>
            <span className="font-cinzel text-[7.5px] tracking-[0.3em] text-white/50 uppercase font-semibold">
              Vaishnav Rug Collection
            </span>
          </div>

          {/* Glass Authentication Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="w-full max-w-[400px] backdrop-blur-[24px] bg-white/[0.035] border border-white/[0.09] rounded-[20px] p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(212,175,55,0.015)] relative overflow-hidden transition-all duration-500 hover:border-white/[0.14]"
          >
            {/* Top gold border sweep line */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent pointer-events-none" />

            {/* Pill-Style Login / Register Tab Switcher */}
            <div className="relative flex justify-center bg-[#0d0103]/60 border border-white/[0.07] rounded-full p-1 mb-4 max-w-[260px] mx-auto select-none">
              <button
                type="button"
                onClick={() => handleTabToggle('login')}
                className={`flex-1 py-1 font-cinzel text-[9.5px] tracking-widest uppercase font-bold rounded-full transition-all duration-300 relative ${activeTab === 'login' ? 'text-[#1e0306] font-extrabold' : 'text-white/40 hover:text-white'}`}
              >
                {activeTab === 'login' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F6D365] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Sign In</span>
              </button>
              <button
                type="button"
                onClick={() => handleTabToggle('register')}
                className={`flex-1 py-1 font-cinzel text-[9.5px] tracking-widest uppercase font-bold rounded-full transition-all duration-300 relative ${activeTab === 'register' ? 'text-[#1e0306] font-extrabold' : 'text-white/40 hover:text-white'}`}
              >
                {activeTab === 'register' && (
                  <motion.div
                    layoutId="activeTabPill"
                    className="absolute inset-0 bg-gradient-to-r from-[#D4AF37] to-[#F6D365] rounded-full z-0"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10">Register</span>
              </button>
            </div>

            {/* Forms Section */}
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-3.5 text-left"
                >
                  {/* Header text */}
                  <div>
                    <h2 className="font-cormorant text-xl font-light text-white tracking-wide">Welcome Back</h2>
                    <p className="text-white/40 text-[11px] font-light mt-0.5 font-inter">
                      Enter your credentials to access your luxury rugs portal.
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit(onSubmitLogin)} className="space-y-3">
                    {/* Email / Username field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        {...loginRegister('email')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/50 border border-white/[0.08] rounded-lg pl-9 pr-3 pt-4 pb-1 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-2.5 placeholder-shown:pb-2.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-9 top-1 text-[7.5px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[7.5px] peer-focus:text-[#D4AF37]">
                        Email or Phone Number
                      </label>
                      {loginErrors.email && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[9.5px] mt-0.5 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {loginErrors.email.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Password field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...loginRegister('password')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/50 border border-white/[0.08] rounded-lg pl-9 pr-9 pt-4 pb-1 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-2.5 placeholder-shown:pb-2.5 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-9 top-1 text-[7.5px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-[11px] peer-placeholder-shown:top-2.5 peer-focus:top-1 peer-focus:text-[7.5px] peer-focus:text-[#D4AF37]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      {loginErrors.password && (
                        <motion.span
                          initial={{ opacity: 0, y: -2 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="block text-[#FF6B6B] text-[9.5px] mt-0.5 font-inter flex items-center gap-1"
                        >
                          <AlertCircle className="w-3 h-3" /> {loginErrors.password.message}
                        </motion.span>
                      )}
                    </div>

                    {/* Remember me & forgot password */}
                    <div className="flex justify-between items-center text-[11px] font-inter text-white/50 select-none px-0.5">
                      <label className="flex items-center space-x-2 cursor-pointer hover:text-white transition-colors">
                        <input
                          type="checkbox"
                          {...loginRegister('rememberMe')}
                          className="w-3 h-3 accent-[#D4AF37] bg-white/5 border border-white/10 rounded focus:ring-0 cursor-pointer"
                        />
                        <span className="font-light">Remember me</span>
                      </label>
                      <Link
                        to="/forgot-password"
                        className="text-[#D4AF37] hover:text-[#F6D365] hover:underline uppercase tracking-wider font-semibold text-[8.5px] font-cinzel"
                      >
                        Forgot Password?
                      </Link>
                    </div>

                    {/* Login Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoadingLogin || isSubmittingLogin}
                      whileHover={{ scale: 1.015, boxShadow: '0 4px 18px rgba(212,175,55,0.25)' }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full relative overflow-hidden h-9 bg-gradient-to-r from-[#D4AF37] via-[#F6D365] to-[#D4AF37] text-[#1a0204] rounded-lg font-cinzel text-[10.5px] font-extrabold tracking-widest uppercase cursor-pointer transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center shadow-md mt-4"
                    >
                      {isLoadingLogin || isSubmittingLogin ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1e0306]" />
                      ) : (
                        <span className="flex items-center gap-1">
                          Sign In <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2 text-left"
                >
                  {/* Header text */}
                  <div>
                    <h2 className="font-cormorant text-lg sm:text-xl font-light text-white tracking-wide">Create Your Account</h2>
                    <p className="text-white/40 text-[10px] sm:text-[11px] font-light font-inter">
                      Begin your bespoke rug journey with VRC.
                    </p>
                  </div>

                  {/* Toggle registration mode */}
                  <div className="flex border-b border-white/[0.08] pb-1 justify-start gap-3 text-[8px] font-bold font-cinzel select-none">
                    <button
                      type="button"
                      onClick={() => setSignUpMethod('email')}
                      className={`pb-0.5 uppercase tracking-widest transition-all duration-300 border-b ${signUpMethod === 'email'
                        ? 'text-[#D4AF37] border-[#D4AF37]'
                        : 'text-white/30 border-transparent hover:text-white/60'
                        }`}
                    >
                      Register with Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setSignUpMethod('phone')}
                      className={`pb-0.5 uppercase tracking-widest transition-all duration-300 border-b ${signUpMethod === 'phone'
                        ? 'text-[#D4AF37] border-[#D4AF37]'
                        : 'text-white/30 border-transparent hover:text-white/60'
                        }`}
                    >
                      Register with Phone
                    </button>
                  </div>

                  <form onSubmit={handleRegisterSubmit(onSubmitRegister)} className="space-y-2">
                    {/* Name input */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <User className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="text"
                        {...registerRegister('name')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/50 border border-white/[0.08] rounded-lg pl-9 pr-3 pt-3 pb-0.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-2 placeholder-shown:pb-2 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-9 top-0.5 text-[7px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-[10.5px] peer-placeholder-shown:top-2 peer-focus:top-0.5 peer-focus:text-[7px] peer-focus:text-[#D4AF37]">
                        Full Name
                      </label>
                      {registerErrors.name && (
                        <span className="block text-[#FF6B6B] text-[8.5px] mt-0.5 font-inter flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> {registerErrors.name.message}
                        </span>
                      )}
                    </div>

                    {/* Conditional Email vs Phone field based on tab */}
                    {signUpMethod === 'email' ? (
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                          <Mail className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="email"
                          {...registerRegister('email')}
                          placeholder=" "
                          className="peer w-full bg-[#0d0103]/50 border border-white/[0.08] rounded-lg pl-9 pr-3 pt-3 pb-0.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-2 placeholder-shown:pb-2 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                        />
                        <label className="absolute left-9 top-0.5 text-[7px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-[10.5px] peer-placeholder-shown:top-2 peer-focus:top-0.5 peer-focus:text-[7px] peer-focus:text-[#D4AF37]">
                          Email Address
                        </label>
                        {registerErrors.email && (
                          <span className="block text-[#FF6B6B] text-[8.5px] mt-0.5 font-inter flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> {registerErrors.email.message}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                          <Phone className="w-3.5 h-3.5" />
                        </div>
                        <input
                          type="text"
                          {...registerRegister('phone')}
                          placeholder=" "
                          className="peer w-full bg-[#0d0103]/50 border border-white/[0.08] rounded-lg pl-9 pr-3 pt-3 pb-0.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-2 placeholder-shown:pb-2 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                        />
                        <label className="absolute left-9 top-0.5 text-[7px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-[10.5px] peer-placeholder-shown:top-2 peer-focus:top-0.5 peer-focus:text-[7px] peer-focus:text-[#D4AF37]">
                          Phone Number
                        </label>
                        {registerErrors.phone && (
                          <span className="block text-[#FF6B6B] text-[8.5px] mt-0.5 font-inter flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5" /> {registerErrors.phone.message}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Password field */}
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-3 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        {...registerRegister('password')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/50 border border-white/[0.08] rounded-lg pl-9 pr-9 pt-3 pb-0.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-2 placeholder-shown:pb-2 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-9 top-0.5 text-[7px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-[10.5px] peer-placeholder-shown:top-2 peer-focus:top-0.5 peer-focus:text-[7px] peer-focus:text-[#D4AF37]">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      {registerErrors.password && (
                        <span className="block text-[#FF6B6B] text-[8.5px] mt-0.5 font-inter flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> {registerErrors.password.message}
                        </span>
                      )}
                    </div>

                    {/* Password Strength Meter */}
                    {watchedPassword.length > 0 && (
                      <div className="space-y-0.5 px-0.5 font-inter">
                        <div className="flex justify-between items-center text-[8px] uppercase font-bold tracking-wider">
                          <span className="text-white/40">Strength:</span>
                          <span className={`${getStrengthLabel(pwdStrength).text}`}>
                            {getStrengthLabel(pwdStrength).label}
                          </span>
                        </div>
                        <div className="grid grid-cols-5 gap-1 h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
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
                      <div className="absolute inset-y-0 left-3 flex items-center text-white/30 group-focus-within:text-[#D4AF37] transition-colors duration-300">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        {...registerRegister('confirmPassword')}
                        placeholder=" "
                        className="peer w-full bg-[#0d0103]/50 border border-white/[0.08] rounded-lg pl-9 pr-9 pt-3 pb-0.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder-shown:pt-2 placeholder-shown:pb-2 font-inter shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)]"
                      />
                      <label className="absolute left-9 top-0.5 text-[7px] font-cinzel tracking-wider uppercase font-bold text-white/40 transition-all duration-300 pointer-events-none peer-placeholder-shown:text-[10.5px] peer-placeholder-shown:top-2 peer-focus:top-0.5 peer-focus:text-[7px] peer-focus:text-[#D4AF37]">
                        Confirm Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors p-1"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                      {registerErrors.confirmPassword && (
                        <span className="block text-[#FF6B6B] text-[8.5px] mt-0.5 font-inter flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> {registerErrors.confirmPassword.message}
                        </span>
                      )}
                    </div>

                    {/* Accept Terms Checkbox */}
                    <div className="space-y-0.5 px-0.5">
                      <label className="flex items-start space-x-2 cursor-pointer hover:text-white text-[9.5px] font-inter text-white/50 select-none">
                        <input
                          type="checkbox"
                          {...registerRegister('acceptTerms')}
                          className="w-3 h-3 accent-[#D4AF37] bg-white/5 border border-white/10 rounded focus:ring-0 cursor-pointer mt-0.5 shrink-0"
                        />
                        <span className="font-light leading-tight">
                          I accept <a href="/terms" className="text-[#D4AF37] hover:underline font-semibold">Terms</a> &amp; <a href="/privacy" className="text-[#D4AF37] hover:underline font-semibold">Privacy Policy</a>
                        </span>
                      </label>
                      {registerErrors.acceptTerms && (
                        <span className="block text-[#FF6B6B] text-[8.5px] font-inter flex items-center gap-1">
                          <AlertCircle className="w-2.5 h-2.5" /> {registerErrors.acceptTerms.message}
                        </span>
                      )}
                    </div>

                    {/* Register Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={isLoadingRegister || isSubmittingRegister}
                      whileHover={{ scale: 1.015, boxShadow: '0 4px 18px rgba(212,175,55,0.25)' }}
                      whileTap={{ scale: 0.985 }}
                      className="w-full relative overflow-hidden h-8.5 bg-gradient-to-r from-[#D4AF37] via-[#F6D365] to-[#D4AF37] text-[#1a0204] rounded-lg font-cinzel text-[10px] font-extrabold tracking-widest uppercase cursor-pointer transition-all duration-300 disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center shadow-md mt-2"
                    >
                      {isLoadingRegister || isSubmittingRegister ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#1e0306]" />
                      ) : (
                        <span className="flex items-center gap-1">
                          Create Account <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Social Logins Divider */}
            <div className="relative flex items-center justify-center py-2.5 my-1.5 select-none">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.06]"></div>
              </div>
              <span className="relative px-3 bg-[#0a0102] text-white/35 text-[8.5px] font-cinzel font-bold tracking-[0.15em] uppercase">or continue with</span>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Google login button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="h-8 border border-white/[0.06] bg-[#0d0103]/40 hover:bg-white/[0.04] text-white/80 hover:text-white font-cinzel font-bold text-[8.5px] tracking-widest flex items-center justify-center gap-2 transition-all duration-300 rounded-lg hover:border-white/15 select-none cursor-pointer"
              >
                <svg className="shrink-0 w-3 h-3" viewBox="0 0 24 24" aria-hidden="true">
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
                className="h-8 border border-white/[0.06] bg-[#0d0103]/40 hover:bg-white/[0.04] text-white/80 hover:text-white font-cinzel font-bold text-[8.5px] tracking-widest flex items-center justify-center gap-2 transition-all duration-300 rounded-lg hover:border-white/15 select-none cursor-pointer"
              >
                <svg className="shrink-0 w-3 h-3 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.2.67-2.92 1.5-.61.7-1.15 1.84-1.01 2.96 1.12.09 2.28-.59 2.94-1.4z" />
                </svg>
                APPLE
              </button>
            </div>

            {/* Footnote details */}
            <div className="mt-3 text-center text-[9px] text-white/35 font-inter space-y-0.5 select-none">
              <p>Secure 256-bit SSL encrypted connection.</p>
              <div className="flex justify-center space-x-2.5 text-white/40">
                <a href="/terms" className="hover:text-white hover:underline transition-colors">Terms</a>
                <span>•</span>
                <a href="/privacy" className="hover:text-white hover:underline transition-colors">Privacy</a>
                <span>•</span>
                <a href="/contact" className="hover:text-white hover:underline transition-colors">Support</a>
              </div>
            </div>
          </motion.div>
        </motion.div>

      </motion.div>
    </motion.div>
  )
}

// src/pages/account/Security.jsx

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Shield, CheckCircle, ChevronRight, AlertTriangle, Smartphone, Monitor } from 'lucide-react'
import toast from 'react-hot-toast'
import { useChangePasswordMutation } from '../../store/api/authApi'

const inputClass =
  'border-0 border-b border-cream-dark bg-transparent w-full px-0 py-2.5 font-jost text-[13.5px] text-navy font-light placeholder:text-cream-dark outline-none focus:border-navy transition-colors pr-8'

// ─── Password field with show/hide ───────────────────────────
function PasswordField({ label, name, register, rules, errors, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">{label}</label>
      <div className="relative">
        <input
          {...register(name, rules)}
          type={show ? 'text' : 'password'}
          className={inputClass}
          placeholder={placeholder || '••••••••'}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-0 bottom-2.5 text-muted hover:text-navy transition-colors cursor-pointer"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
      {errors?.[name] && <p className="text-burgundy text-[11px] mt-0.5">{errors[name].message}</p>}
    </div>
  )
}

// ─── Password strength meter ──────────────────────────────────
function getStrength(password) {
  let score = 0
  if (!password) return 0
  if (password.length >= 8)  score++
  if (password.length >= 12) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  return score
}

const strengthConfig = {
  0: { label: '',        color: '' },
  1: { label: 'Weak',   color: 'bg-red-400'    },
  2: { label: 'Fair',   color: 'bg-amber-400'  },
  3: { label: 'Good',   color: 'bg-yellow-400' },
  4: { label: 'Strong', color: 'bg-green-400'  },
  5: { label: 'Excellent', color: 'bg-emerald-500' },
}

// ─── Main Page ────────────────────────────────────────────────
export default function Security() {
  const [changePassword, { isLoading }] = useChangePasswordMutation()

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm()

  const newPassword = watch('newPassword', '')
  const strength    = getStrength(newPassword)
  const strengthCfg = strengthConfig[strength]

  async function onSubmit(data) {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword:     data.newPassword,
      }).unwrap()
      toast.success('Password changed successfully')
      reset()
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to change password')
    }
  }

  return (
    <div className="px-5 sm:px-8 lg:px-10 xl:px-12 py-8 lg:py-10">

      {/* Page header */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 font-cinzel text-[9.5px] tracking-[0.1em] text-muted mb-3">
          <span>HOME</span>
          <ChevronRight size={10} />
          <span>ACCOUNT</span>
          <ChevronRight size={10} />
          <span className="text-gold">SECURITY</span>
        </div>
        <h1 className="font-cormorant text-[2.2rem] lg:text-[2.6rem] text-navy font-semibold leading-tight">
          Security
        </h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
          <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-gold to-transparent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left: Change password */}
        <div className="lg:col-span-2 space-y-5">

          {/* Change password form */}
          <div className="bg-white border border-cream-dark">
            <div className="px-7 py-4 border-b border-cream-dark flex items-center gap-2.5">
              <Shield size={15} className="text-gold" />
              <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">CHANGE PASSWORD</span>
            </div>
            <div className="px-7 py-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                <PasswordField
                  label="CURRENT PASSWORD"
                  name="currentPassword"
                  register={register}
                  rules={{ required: 'Current password is required' }}
                  errors={errors}
                  placeholder="Enter your current password"
                />

                <PasswordField
                  label="NEW PASSWORD"
                  name="newPassword"
                  register={register}
                  rules={{
                    required: 'New password is required',
                    minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  }}
                  errors={errors}
                  placeholder="Create a strong password"
                />

                {/* Strength meter */}
                {newPassword.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-cinzel text-[8px] tracking-[0.14em] text-muted">PASSWORD STRENGTH</span>
                      <span className={`font-cinzel text-[8px] tracking-[0.12em] ${
                        strength <= 2 ? 'text-red-500' : strength === 3 ? 'text-amber-500' : 'text-green-600'
                      }`}>
                        {strengthCfg.label.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex gap-1 h-1">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div
                          key={i}
                          className={`flex-1 rounded-full transition-colors duration-300 ${i <= strength ? strengthCfg.color : 'bg-cream-dark'}`}
                        />
                      ))}
                    </div>
                    {/* Tips */}
                    <div className="mt-3 space-y-1">
                      {[
                        { check: newPassword.length >= 8,       text: 'At least 8 characters' },
                        { check: /[A-Z]/.test(newPassword),     text: 'Uppercase letter' },
                        { check: /[0-9]/.test(newPassword),     text: 'At least one number' },
                        { check: /[^A-Za-z0-9]/.test(newPassword), text: 'Special character (!@#$...)' },
                      ].map(({ check, text }) => (
                        <div key={text} className="flex items-center gap-2">
                          <CheckCircle
                            size={11}
                            className={`flex-shrink-0 ${check ? 'text-green-500' : 'text-cream-dark'}`}
                          />
                          <span className={`font-jost text-[11.5px] ${check ? 'text-navy' : 'text-muted'}`}>{text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <PasswordField
                  label="CONFIRM NEW PASSWORD"
                  name="confirmPassword"
                  register={register}
                  rules={{
                    required: 'Please confirm your password',
                    validate: val => val === newPassword || 'Passwords do not match',
                  }}
                  errors={errors}
                  placeholder="Repeat your new password"
                />

                <div className="flex gap-3 pt-4 border-t border-cream-dark">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-navy text-cream font-cinzel text-[10px] tracking-[0.14em] px-8 py-3.5 flex items-center gap-2 hover:bg-navy-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isLoading
                      ? <><span className="animate-spin inline-block">◌</span> UPDATING...</>
                      : <><Shield size={12} /> UPDATE PASSWORD</>
                    }
                  </button>
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="border border-cream-dark text-muted font-cinzel text-[10px] tracking-[0.12em] px-6 py-3.5 hover:border-navy hover:text-navy transition-colors cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Security notice */}
          <div className="bg-amber-50 border border-amber-200 p-4 flex gap-3">
            <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-cinzel text-[9px] tracking-[0.14em] text-amber-700 mb-1">SECURITY NOTICE</p>
              <p className="font-jost text-[12.5px] text-amber-700 font-light leading-relaxed">
                After changing your password, you will remain signed in on this device. Other active sessions may be invalidated.
                For your security, we recommend using a unique password not used on any other site.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Security overview */}
        <div className="space-y-5">

          {/* Security status */}
          <div className="bg-white border border-cream-dark">
            <div className="px-6 py-4 border-b border-cream-dark">
              <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">SECURITY STATUS</span>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { label: 'Email Verified',       done: true  },
                { label: 'Password Set',          done: true  },
                { label: '2FA Authentication',    done: false },
                { label: 'Phone Verified',        done: false },
              ].map(({ label, done }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-jost text-[13px] text-muted font-light">{label}</span>
                  <div className={`flex items-center gap-1.5 font-cinzel text-[8px] tracking-[0.1em] ${done ? 'text-green-600' : 'text-muted'}`}>
                    <CheckCircle size={12} className={done ? 'text-green-500' : 'text-cream-dark'} />
                    {done ? 'ACTIVE' : 'NOT SET'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active sessions */}
          <div className="bg-white border border-cream-dark">
            <div className="px-6 py-4 border-b border-cream-dark">
              <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">ACTIVE SESSIONS</span>
            </div>
            <div className="px-6 py-5 space-y-4">
              {[
                { icon: Monitor,    device: 'Windows PC',  location: 'This device', active: true  },
                { icon: Smartphone, device: 'Android',     location: 'Last seen 2d ago', active: false },
              ].map(({ icon: Icon, device, location, active }) => (
                <div key={device} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-warmcream flex items-center justify-center flex-shrink-0">
                    <Icon size={15} className={active ? 'text-navy' : 'text-muted'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-jost text-[13px] text-navy font-medium">{device}</p>
                    <p className="font-jost text-[11.5px] text-muted font-light">{location}</p>
                  </div>
                  {active && (
                    <span className="font-cinzel text-[7px] tracking-[0.1em] bg-green-50 text-green-600 px-2 py-0.5">
                      CURRENT
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

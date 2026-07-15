// src/pages/account/Profile.jsx

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, setCredentials } from '../../store/authSlice'
import { ShoppingBag, Heart, MapPin, IndianRupee, CheckCircle, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { useUpdateProfileMutation } from '../../store/api/authApi'

// ─── Reusable sub-components ──────────────────────────────────

function PageHeader({ crumb, title }) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-1.5 font-cinzel text-[9.5px] tracking-[0.1em] text-muted mb-3">
        <span>HOME</span>
        <ChevronRight size={10} />
        <span>ACCOUNT</span>
        <ChevronRight size={10} />
        <span className="text-gold">{crumb}</span>
      </div>
      <h1 className="font-cormorant text-[2.2rem] lg:text-[2.6rem] text-navy font-semibold leading-tight">
        {title}
      </h1>
      {/* Gold gradient rule */}
      <div className="flex items-center gap-2 mt-2">
        <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
        <div className="h-px flex-1 max-w-[180px] bg-gradient-to-r from-gold to-transparent" />
      </div>
    </div>
  )
}

function FormSection({ title, children }) {
  return (
    <div className="bg-white border border-cream-dark mb-5">
      <div className="flex items-center justify-between px-7 py-4 border-b border-cream-dark">
        <span className="font-cinzel text-[10.5px] tracking-[0.18em] text-navy">{title}</span>
      </div>
      <div className="px-7 py-6">{children}</div>
    </div>
  )
}

function FormField({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-cinzel text-[8.5px] tracking-[0.2em] text-gold">{label}</label>
      {children}
      {error && <p className="text-burgundy text-[11px] mt-0.5">{error.message}</p>}
    </div>
  )
}

const inputClass =
  'border-0 border-b border-cream-dark bg-transparent px-0 py-2.5 w-full font-jost text-[13.5px] text-navy font-light placeholder:text-cream-dark placeholder:text-[13px] outline-none focus:border-navy transition-colors disabled:text-muted disabled:cursor-not-allowed'

// ─── Main Page ────────────────────────────────────────────────
export default function Profile() {
  const user     = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [updateProfile, { isLoading: saving }] = useUpdateProfileMutation()

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    defaultValues: {
      firstName:  user?.name?.split(' ')[0] || '',
      lastName:   user?.name?.split(' ').slice(1).join(' ') || '',
      email:      user?.email || '',
      phone:      user?.phone || '',
      city:       user?.city  || '',
    },
  })

  async function onSubmit(data) {
    try {
      const res = await updateProfile({
        name:  `${data.firstName} ${data.lastName}`.trim(),
        email: data.email,
        phone: data.phone,
        city:  data.city,
      }).unwrap()
      dispatch(setCredentials({ user: res.user, token: res.token }))
      reset({
        firstName: res.user?.name?.split(' ')[0] || data.firstName,
        lastName:  res.user?.name?.split(' ').slice(1).join(' ') || data.lastName,
        email:     res.user?.email || data.email,
        phone:     res.user?.phone || data.phone,
        city:      res.user?.city  || data.city,
      })
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err?.data?.message || 'Failed to update profile')
    }
  }

  return (
    <div className="px-5 sm:px-8 lg:px-10 xl:px-12 py-8 lg:py-10">
      <PageHeader crumb="MY PROFILE" title="My Profile" />

      {/* ─── Stats cards ─── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
        {[
          { icon: ShoppingBag, num: user?.ordersCount ?? 0,   label: 'Total Orders',    color: 'text-gold'     },
          { icon: Heart,       num: user?.wishlistCount ?? 0,  label: 'Wishlisted',      color: 'text-burgundy' },
          { icon: MapPin,      num: user?.addresses?.length ?? 0, label: 'Addresses',   color: 'text-navy'     },
          { icon: IndianRupee, num: user?.totalSpent ? `${(user.totalSpent / 1000).toFixed(0)}K` : '0', label: 'Total Spent', color: 'text-gold' },
        ].map(({ icon: Icon, num, label, color }) => (
          <div key={label} className="bg-white border border-cream-dark p-4 lg:p-5 flex items-center gap-3 lg:gap-4">
            <div className="w-9 h-9 lg:w-10 lg:h-10 bg-warmcream flex items-center justify-center flex-shrink-0">
              <Icon size={18} className={color} />
            </div>
            <div>
              <div className="font-cormorant text-[22px] lg:text-[26px] text-navy font-medium leading-none">
                {num}
              </div>
              <div className="font-cinzel text-[7.5px] lg:text-[8px] tracking-[0.14em] text-muted mt-1">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Personal Information form ─── */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormSection title="PERSONAL INFORMATION">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">

            <FormField label="FIRST NAME" error={errors.firstName}>
              <input
                {...register('firstName', { required: 'First name is required' })}
                className={inputClass}
                placeholder="Your first name"
              />
            </FormField>

            <FormField label="LAST NAME">
              <input
                {...register('lastName')}
                className={inputClass}
                placeholder="Your last name"
              />
            </FormField>

            <FormField label="EMAIL ADDRESS" error={errors.email}>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
                })}
                type="email"
                className={inputClass}
                placeholder="you@example.com"
              />
            </FormField>

            <FormField label="PHONE NUMBER" error={errors.phone}>
              <input
                {...register('phone', {
                  pattern: { 
                    value: /^[6-9]\d{9}$/, 
                    message: 'Enter a valid 10-digit Indian number (optional)' 
                  },
                  validate: (value) => !value || /^[6-9]\d{9}$/.test(value) || 'Invalid phone format'
                })}
                type="tel"
                className={inputClass}
                placeholder="+91 XXXXX XXXXX (optional)"
              />
            </FormField>

            <FormField label="CITY">
              <input
                {...register('city')}
                className={inputClass}
                placeholder="Your city"
              />
            </FormField>

            <FormField label="MEMBER SINCE">
              <input
                className={`${inputClass} text-muted cursor-not-allowed`}
                value={
                  user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
                    : '—'
                }
                disabled
                aria-readonly="true"
                readOnly
              />
            </FormField>
          </div>

          {/* Save row */}
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-cream-dark">
            <button
              type="submit"
              disabled={saving || !isDirty}
              className="
                bg-navy text-cream font-cinzel text-[10px] tracking-[0.14em]
                px-8 py-3.5 flex items-center gap-2 cursor-pointer
                hover:bg-navy-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {saving
                ? <><span className="animate-spin inline-block">◌</span> SAVING...</>
                : <><CheckCircle size={13} /> SAVE CHANGES</>
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
        </FormSection>
      </form>

    </div>
  )
}

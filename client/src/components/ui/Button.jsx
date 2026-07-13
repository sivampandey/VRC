import React from 'react'
import { motion } from 'framer-motion'

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  loading = false,
  ...rest
}) {
  const baseStyles = 'inline-flex items-center justify-center font-cinzel tracking-widest uppercase select-none transition-all duration-300 cursor-pointer relative overflow-hidden'

  const variants = {
    primary: '',
    outline: '',
    ghost: '',
  }

  const sizes = {
    md: 'px-8 py-3.5 text-[11px]',
    sm: 'px-6 py-2.5 text-[10px]',
  }

  // Luxury inline styles for each variant
  const variantStyles = {
    primary: {
      background: 'linear-gradient(135deg, #C9A56A 0%, #E8C97A 50%, #C9A56A 100%)',
      color: '#0D0B09',
      border: '1px solid rgba(201,165,106,0.6)',
      boxShadow: '0 0 20px rgba(201,165,106,0.15)',
    },
    outline: {
      background: 'transparent',
      color: '#F0EAE0',
      border: '1px solid rgba(240,234,224,0.35)',
    },
    ghost: {
      background: 'transparent',
      color: '#F0EAE0',
      border: '1px solid transparent',
    },
  }

  return (
    <motion.button
      whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
      whileTap={!loading ? { scale: 0.98 } : {}}
      disabled={loading}
      className={`${baseStyles} ${sizes[size]} ${className} ${
        loading ? 'cursor-not-allowed opacity-75' : ''
      }`}
      style={variantStyles[variant]}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}

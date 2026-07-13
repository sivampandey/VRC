import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import logoImg from '../../assets/logo.png'

export default function IntroSplash() {
  const [show, setShow] = useState(false)

useEffect(() => {
  const alreadyShown = sessionStorage.getItem("vrc_intro_shown")
  setShow(!alreadyShown)
}, [])

  useEffect(() => {
    if (!show) return
    
    // Auto-dismiss after 2.2s (slightly faster and more responsive)
    const timer = setTimeout(() => {
      setShow(false)
      sessionStorage.setItem('vrc_intro_shown', 'true')
    }, 2200)
    
    return () => clearTimeout(timer)
  }, [show])

  const handleDismiss = () => {
    setShow(false)
    sessionStorage.setItem('vrc_intro_shown', 'true')
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro-splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
          onClick={handleDismiss}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
          style={{ background: '#FAF5F0' }}
        >
          {/* Ambient radial glow behind logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 0.15, scale: 1.5 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #C9A56A 0%, transparent 70%)',
            }}
          />

          {/* Thin horizontal ornamental lines */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 0.15 }}
              transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
              className="absolute top-1/2 left-0 right-0 h-[1px]"
              style={{ background: 'linear-gradient(90deg, transparent, #C9A56A, transparent)', transformOrigin: 'center' }}
            />
          </div>

          {/* Main content: Logo + brand text */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Logo image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={logoImg}
                alt="Vaishnav Rug Collection"
                className="w-40 h-40 md:w-52 md:h-52 object-contain drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 30px rgba(201,165,106,0.4))' }}
              />
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, letterSpacing: '0.3em' }}
              animate={{ opacity: 1, letterSpacing: '0.45em' }}
              transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
              className="text-[10px] md:text-xs tracking-[0.45em] uppercase font-cinzel text-center"
              style={{ color: '#160400' }}
            >
              Woven with Tradition, Made for Generations
            </motion.p>
          </div>

          {/* Loading progress bar at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: 'rgba(201,165,106,0.12)' }}
          >
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2.8, ease: 'easeInOut' }}
              className="h-full"
              style={{
                background: 'linear-gradient(90deg, transparent, #C9A56A, #E8C97A, #C9A56A)',
                transformOrigin: 'left',
              }}
            />
          </div>

          {/* Corner ornaments */}
          {[
            'top-8 left-8',
            'top-8 right-8 rotate-90',
            'bottom-8 left-8 -rotate-90',
            'bottom-8 right-8 rotate-180',
          ].map((pos, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className={`absolute ${pos} w-12 h-12`}
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
                <path d="M4 4 L4 20 M4 4 L20 4" stroke="#C9A56A" strokeWidth="1" />
              </svg>
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

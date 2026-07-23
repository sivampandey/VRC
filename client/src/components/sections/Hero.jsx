import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
})

// Floating gold dust particles
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: Math.random() * 3 + 1.5,
  x: Math.random() * 100,
  delay: Math.random() * 6,
  duration: 6 + Math.random() * 8,
  opacity: 0.15 + Math.random() * 0.35,
}))

export default function Hero() {
  return (
    <section className="hero" role="banner">
      {/* ── Floating gold dust particles ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1]">
        {PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              bottom: '-10px',
              background: `rgba(201,165,106,${p.opacity})`,
              filter: 'blur(0.5px)',
            }}
            animate={{
              y: [0, -(220 + Math.random() * 180)],
              x: [0, (Math.random() - 0.5) * 60],
              opacity: [0, p.opacity, p.opacity * 0.7, 0],
              scale: [1, 1.4, 0.6],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* ── Hero Content ── */}
      <div className="hero-inner relative z-[2] flex flex-col items-center">

        {/* Gold tagline */}
        <motion.div {...fadeUp(0)} className="hero-label">
          SINCE 2005 &nbsp;·&nbsp; BHADOHI, INDIA
        </motion.div>

        {/* Brand header title */}
        <motion.h1 {...fadeUp(0.15)} className="hero-h">
          Woven with Tradition,
        </motion.h1>
        <motion.h1 {...fadeUp(0.25)} className="hero-hi">
          Made for Generations.
        </motion.h1>

        {/* Gold divider line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.1, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-px mb-7 bg-gradient-to-r from-transparent via-[#C9A56A] to-transparent"
          style={{ transformOrigin: 'center' }}
        />

        {/* Subtitle */}
        <motion.p {...fadeUp(0.35)} className="hero-sub">
          Handcrafted rugs from the carpet capital of India — each knot tied with four
          hundred years of Bhadohi's inherited artistry.
        </motion.p>

        {/* Action CTAs */}
        <motion.div {...fadeUp(0.45)} className="hero-btns">
          <Link to="/shop">
            <motion.button
              className="btn-g select-none uppercase font-semibold flex items-center gap-2"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              EXPLORE COLLECTION &nbsp; →
            </motion.button>
          </Link>
          <Link to="/about">
            <motion.button
              className="btn-co select-none uppercase font-semibold"
              whileHover={{ scale: 1.03, borderColor: 'rgba(201,165,106,0.65)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              OUR STORY
            </motion.button>
          </Link>
        </motion.div>

        {/* Stats row */}
        <motion.div
          {...fadeUp(0.55)}
          className="hero-stats"
        >
          {[
            { num: '400+', label: 'YEARS OF HERITAGE' },
            { num: '10K+', label: 'RUGS CRAFTED' },
            { num: '50+', label: 'COUNTRIES DELIVERED' },
          ].map((stat, i) => (
            <React.Fragment key={stat.label}>
              {i > 0 && <div className="hdivide" />}
              <div className="hstat">
                <motion.div
                  className="hstat-num"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {stat.num}
                </motion.div>
                <div className="hstat-label">{stat.label}</div>
              </div>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* ── Floating scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none z-[2]"
      >
        <span className="font-cinzel text-[7.5px] tracking-[0.25em] text-white/40 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          className="w-[1px] h-8"
          style={{ background: 'linear-gradient(to bottom, var(--G), transparent)' }}
        />
      </motion.div>
    </section>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 25 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] },
})

export default function Hero() {
  return (
    <section className="hero" role="banner">
      {/* Background is styled directly in index.css as a dark overlay with Unsplash luxury room image */}
      <div className="hero-inner relative z-10 flex flex-col items-center">
        
        {/* Gold tagline info */}
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

        {/* Subtitle statement */}
        <motion.p {...fadeUp(0.35)} className="hero-sub">
          Handcrafted rugs from the carpet capital of India — each knot tied with four
          hundred years of Bhadohi’s inherited artistry.
        </motion.p>

        {/* Action CTAs */}
        <motion.div {...fadeUp(0.45)} className="hero-btns">
          <Link to="/shop">
            <button className="btn-g select-none uppercase font-semibold flex items-center gap-2">
              EXPLORE COLLECTION &nbsp; →
            </button>
          </Link>
          <Link to="/about">
            <button className="btn-co select-none uppercase font-semibold">
              OUR STORY
            </button>
          </Link>
        </motion.div>

      </div>

      {/* Floating scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
      >
        <span className="font-cinzel text-[7.5px] tracking-[0.25em] text-white/40 uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
          className="w-[1px] h-8"
          style={{ background: 'linear-gradient(to bottom, var(--G), transparent)' }}
        />
      </motion.div>
    </section>
  )
}

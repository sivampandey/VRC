import React from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'

export default function Newsletter() {
  const handleSubscribe = (e) => {
    e.preventDefault()
    const email = new FormData(e.target).get('newsletter-email')
    toast.success(`Thank you! ${email} has been subscribed to VRC.`)
    e.target.reset()
  }

  return (
    <section className="bg-[#160400] py-20 px-6 text-center text-[#FAF5F0] border-t border-[#C9A56A]/10 relative z-10 overflow-hidden" role="region" aria-label="Newsletter signup">
      {/* Ambient glow pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(201,165,106,0.08) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.06, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="container max-w-[660px] mx-auto space-y-6 relative z-10">
        <ScrollReveal direction="up" className="space-y-3">
          <span className="block text-[9.5px] uppercase font-cinzel tracking-[0.25em] text-[#C9A56A] font-bold">
            STAY INSPIRED
          </span>
          <h2 className="font-cormorant text-3xl sm:text-4xl text-[#FAF5F0] font-normal leading-tight max-w-[540px] mx-auto">
            New Collections, Weaving Stories &amp; Private Offers.
          </h2>
          <p className="text-xs text-[#FAF5F0]/65 font-jost leading-relaxed max-w-[420px] mx-auto">
            Delivered thoughtfully to your inbox. No spam. Unsubscribe anytime.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.1}>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-[480px] mx-auto pt-4">
            <input
              className="flex-1 bg-transparent border border-[#C9A56A]/30 px-4 py-3 text-xs text-[#FAF5F0] placeholder-[#FAF5F0]/30 focus:border-[#C9A56A] focus:outline-none transition font-jost rounded-none"
              type="email"
              name="newsletter-email"
              placeholder="Your email address"
              aria-label="Email address"
              required
            />
            <motion.button
              type="submit"
              className="bg-[#C9A56A] text-[#160400] font-cinzel font-bold text-[10px] tracking-widest px-8 py-3 rounded-none shrink-0 relative overflow-hidden"
              whileHover={{ scale: 1.04, backgroundColor: '#E4CEA8' }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              SUBSCRIBE
            </motion.button>
          </form>
        </ScrollReveal>
      </div>
    </section>
  )
}

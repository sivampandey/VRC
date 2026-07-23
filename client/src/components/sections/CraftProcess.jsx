import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import weaverHandsImg from '../../assets/weaver_hands.jpg'

export default function CraftProcess() {
  const steps = [
    { num: '1', label: <>Design &<br />Pattern</> },
    { num: '2', label: <>Natural<br />Dyeing</> },
    { num: '3', label: <>Hand-<br />Knotting</> },
    { num: '4', label: <>Washing &<br />Finishing</> },
    { num: '5', label: <>Quality<br />Check</> }
  ]

  return (
    <section className="craft" role="region" aria-label="Our heritage and craft story">
      {/* ── Left: Image ── */}
      <ScrollReveal direction="left" className="w-full">
        <div className="craft-img h-full min-h-[350px] lg:min-h-[520px] relative overflow-hidden">
          <motion.img
            src={weaverHandsImg}
            alt="Master artisan hand-knotting a traditional rug on a loom in Bhadohi"
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.04 }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-[#160400]/40 pointer-events-none" />

          {/* Gold corner ornaments on image */}
          {[
            'top-5 left-5',
            'top-5 right-5 rotate-90',
            'bottom-5 left-5 -rotate-90',
            'bottom-5 right-5 rotate-180',
          ].map((pos, i) => (
            <motion.div
              key={i}
              className={`absolute ${pos} w-9 h-9 pointer-events-none`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.5 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.08, duration: 0.6 }}
            >
              <svg viewBox="0 0 36 36" fill="none" className="w-full h-full">
                <path d="M3 3 L3 15 M3 3 L15 3" stroke="#C9A56A" strokeWidth="1" />
              </svg>
            </motion.div>
          ))}
        </div>
      </ScrollReveal>

      {/* ── Right side: Story & Steps list ── */}
      <div className="craft-content">
        <ScrollReveal direction="up">
          <div className="craft-lbl">OUR HERITAGE</div>
          <h2 className="craft-h2">
            Every Knot <em>Tells a Story.</em>
          </h2>
          <p className="craft-p">
            Rooted in Bhadohi's 400-year carpet tradition, each Vaishnav rug is the result of weeks of careful hand-knotting by master weavers who have inherited the craft across generations. We bring this timeless art to modern homes.
          </p>
        </ScrollReveal>

        {/* Steps Grid */}
        <div className="craft-steps">
          {steps.map((step, idx) => (
            <motion.div
              key={step.num}
              className="cs"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: 0.1 + idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.08 }}
            >
              <motion.div
                className="cs-n"
                whileHover={{
                  boxShadow: '0 0 20px rgba(201,165,106,0.7)',
                  borderColor: 'rgba(201,165,106,0.9)',
                }}
                transition={{ duration: 0.3 }}
              >
                {step.num}
              </motion.div>
              <div className="cs-l">{step.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Story Link */}
        <ScrollReveal direction="up" delay={0.3}>
          <Link to="/about" className="craft-link uppercase font-bold tracking-wider">
            OUR STORY
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
